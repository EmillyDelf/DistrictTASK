"use server";

import "server-only";

import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

type ChangePasswordResult =
  | { success: true; message: string }
  | { error: string };

const BCRYPT_MAX_BYTES = 72;

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Você precisa estar autenticado." };
  }

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string"
  ) {
    return { error: "Dados inválidos." };
  }

  if (
    newPassword.length < 8 ||
    Buffer.byteLength(newPassword, "utf8") > BCRYPT_MAX_BYTES
  ) {
    return {
      error: "A nova senha deve ter pelo menos 8 caracteres e até 72 bytes.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      error: "A nova senha deve ser diferente da senha atual.",
    };
  }

  try {
    await dbConnect();

    const user = await User.findById(session.user.id).select("+password");

    if (!user) {
      return { error: "Não foi possível localizar sua conta." };
    }

    const passwordIsValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordIsValid) {
      return { error: "Senha atual incorreta." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    user.password = passwordHash;
    user.passwordChangedAt = new Date();

    await user.save();

    return {
      success: true,
      message: "Senha alterada com sucesso.",
    };
  } catch (error: unknown) {
    console.error("Falha ao alterar senha:", error);

    return {
      error: "Não foi possível alterar sua senha.",
    };
  }
}