import { UserRole } from "../../generated/prisma/enums"



export interface IUserRegistered {
    name: string,
    email: string,
    password: string,
    role:UserRole
    profilePhoto?: string,
    phone?:string
}