"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

type RegisterResult = { success: true } | { error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_MAX_BYTES = 72;

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const nameValue = formData.get("name");
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (
    typeof nameValue !== "string" ||
    typeof emailValue !== "string" ||
    typeof passwordValue !== "string"
  ) {
    return { error: "Dados inválidos. Confira os campos e tente novamente." };
  }

  const name = nameValue.trim();
  const email = emailValue.trim().toLowerCase();
  const password = passwordValue;

  if (!name || !email || !password) {
    return { error: "Preencha todos os campos." };
  }
  if (name.length > 80) {
    return { error: "O nome deve ter no máximo 80 caracteres." };
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { error: "Informe um endereço de e-mail válido." };
  }
  if (password.length < 8) {
    return { error: "A senha deve ter pelo menos 8 caracteres." };
  }
  if (Buffer.byteLength(password, "utf8") > BCRYPT_MAX_BYTES) {
    return { error: "A senha excede o limite aceito. Use até 72 bytes." };
  }

  try {
    await dbConnect();
//alterei para que os usuarios não possam se cadastrar com o mesmo email e nem saber se já existe uma conta com aquele email.
    const existingUser = await User.exists({ email });
    if (existingUser) return { error: "Não foi possível concluir o cadastro com os dados informados." };

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashedPassword });

    return { success: true };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return { error: "Este e-mail já está cadastrado." };
    }

    console.error("Falha ao cadastrar usuário:", error);
    return { error: "Não foi possível criar sua conta. Tente novamente." };
  }
}
