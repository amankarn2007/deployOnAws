"use server"
import { prismaClient } from "@repo/db/client";

export async function createUserAction() {
  const user = await prismaClient.user.create({
    data: { 
      username: "amankarn", 
      password: "amankarn" 
    }
  });
  return user;
}