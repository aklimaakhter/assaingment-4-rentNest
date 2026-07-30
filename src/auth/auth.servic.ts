import config from "../config";
import { prisma } from "../lib/prisma";
import { IUserRegistered } from "./auth.interface";
import * as bcrypt from "bcrypt";

const userRegisterIntoDB = async (payload: IUserRegistered) => {
    const { name, email, password, role} = payload

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new Error("User with this email is exist!")
    }

    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role: role || "TENANT"
            
           
        }

    })

    

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email
        },
        omit: {
            password: true
        }

    })
    return user
}

export const authService={
    userRegisterIntoDB
}