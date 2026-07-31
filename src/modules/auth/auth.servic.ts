import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser, IUserRegistered } from "./auth.interface";
import * as bcrypt from "bcrypt";

const userRegisterIntoDB = async (payload: IUserRegistered) => {
    const { name, email, password, role } = payload

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

const loginUserIntoDB = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email }

    })

    if (!user) {
        throw new Error("User does not exist with this email!");
    }

    if (user.status === "BANNED") {
        throw new Error("Your account has been banned by the administrator.");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password incorrect")

    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, {
        expiresIn: config.jwt_access_expires_in
    } as SignOptions);

    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, {
        expiresIn: config.jwt_refresh_expires_in
    } as SignOptions)

    return {
        accessToken,
        refreshToken
        
    }

}


const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error)
    }
    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })


    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role

    }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, { expiresIn: config.jwt_access_expires_in } as SignOptions)

    return { accessToken }
}

const getMyProfileIntoDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: { password: true },
       
    })

    return user
}

export const authService = {
    userRegisterIntoDB,
    loginUserIntoDB,
    getMyProfileIntoDB,
    refreshToken
};

