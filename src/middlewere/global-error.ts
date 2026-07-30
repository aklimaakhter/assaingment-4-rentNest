import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace";


export const globalErrorHandle: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails: unknown = null;

    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error."
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errorDetails ?? null

    } else if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 400;
                message = "Duplicate value";

            case "P2025":
                statusCode = 400;
                message = "Record not found in Database";
            default:
                statusCode = 400;
                message = "Database Error";
                errorDetails = { code: err.code }
        }
    }

}