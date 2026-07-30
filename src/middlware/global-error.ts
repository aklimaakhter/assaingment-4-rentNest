import { ErrorRequestHandler } from "express";
import { success, ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace";
import { PrismaClientValidationError } from "@prisma/client/runtime/client";
import config from "../config";


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
    } else if (err instanceof PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid query"
    }

    if (statusCode === 500 && config.node_env === "production") {
        errorDetails = null;
    } else if (config.node_env !== "production" && err instanceof Error && errorDetails === null) {
        errorDetails = { stack: err.stack }

    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails
    })

}