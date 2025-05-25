"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { signUpSchema } from "~/schemas";
import { db } from "~/server/db";

export async function register(
    prevState: string | undefined, 
    formData: FormData
) {
 try {
    const {email, password} = await signUpSchema.parseAsync({
        email: formData.get("email"),
        password: formData.get("password")
    });

    const user = await db.user.findUnique({
        where: {
            email: email
        }
    });

    if(user) {
        return "User Already Exists!!"
    }

    const hash = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            email: email,
            password: hash,
        },
    });

 } catch (error) {
    if(error instanceof ZodError) {
        return error.errors.map((error) => error.message).join(", ")
    }
 }

 redirect("/signin")
}