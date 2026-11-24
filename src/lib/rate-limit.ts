
import "server-only";

import { Redis } from "@upstash/redis";
import { createHmac } from "node:crypto";

const redis = Redis.fromEnv();

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

const IP_LIMIT = 20;
const EMAIL_LIMIT = 5;

const PREFIX = "district-task:login";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashIdentifier(value: string): string {
  const secret = process.env.RATE_LIMIT_HASH_SECRET;

  if (!secret) {
    throw new Error("RATE_LIMIT_HASH_SECRET não configurado.");
  }

  return createHmac("sha256", secret)
    .update(value)
    .digest("hex");
}

// Operação atômica: verifica bloqueio, incrementa contador
// e aplica o bloqueio quando o limite é atingido.
async function incrementWithLimit(
  counterKey: string,
  lockKey: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remainingMs: number }> {
  const script = `
    local lock = redis.call("GET", KEYS[2])

    if lock then
      return {0, redis.call("PTTL", KEYS[2])}
    end

    local count = redis.call("INCR", KEYS[1])

    if count == 1 then
      redis.call("PEXPIRE", KEYS[1], ARGV[1])
    end

    if count >= tonumber(ARGV[2]) then
      redis.call("SET", KEYS[2], "1", "PX", ARGV[3])
      redis.call("DEL", KEYS[1])
      return {0, tonumber(ARGV[3])}
    end

    return {1, 0}
  `;

const result = await redis.eval(    script,
    [counterKey, lockKey],
    [windowMs, limit, BLOCK_MS]
  );

  if (!Array.isArray(result) || result.length !== 2) {
    throw new Error("Resposta inválida do Redis no rate limiting.");
  }

  const allowed = Number(result[0]);
  const remainingMs = Number(result[1]);

  if (
    !Number.isFinite(allowed) ||
    !Number.isFinite(remainingMs) ||
    (allowed !== 0 && allowed !== 1) ||
    remainingMs < 0
  ) {
    throw new Error("Resposta inválida do Redis no rate limiting.");
  }

  return {
    allowed: allowed === 1,
    remainingMs,
  };
}

// Verifica se existe bloqueio ativo.
async function isBlocked(lockKey: string): Promise<boolean> {
  const result = await redis.exists(lockKey);
  const exists = Number(result);

  if (exists !== 0 && exists !== 1) {
    throw new Error("Resposta inválida do Redis ao verificar bloqueio.");
  }

  return exists === 1;
}

// Proteção por IP: contabiliza todas as tentativas.
export async function checkLoginIp(ip: string) {
  const identifier = hashIdentifier(ip);

  return incrementWithLimit(
    `${PREFIX}:ip:counter:${identifier}`,
    `${PREFIX}:ip:block:${identifier}`,
    IP_LIMIT,
    WINDOW_MS
  );
}

// Proteção por e-mail: verifica se existe bloqueio.
export async function isEmailBlocked(email: string) {
  const identifier = hashIdentifier(normalizeEmail(email));

  return isBlocked(`${PREFIX}:email:block:${identifier}`);
}

// Registra uma falha de autenticação por e-mail.
export async function recordEmailFailure(email: string) {
  const identifier = hashIdentifier(normalizeEmail(email));

  return incrementWithLimit(
    `${PREFIX}:email:counter:${identifier}`,
    `${PREFIX}:email:block:${identifier}`,
    EMAIL_LIMIT,
    WINDOW_MS
  );
}

// Limpa as falhas após uma autenticação bem-sucedida.
export async function clearEmailFailures(email: string) {
  const identifier = hashIdentifier(normalizeEmail(email));

  await redis.del(
    `${PREFIX}:email:counter:${identifier}`,
    `${PREFIX}:email:block:${identifier}`
  );
}
