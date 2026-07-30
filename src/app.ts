import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { globalErrorHandle } from "./middlware/global-error";
import { notFound } from "./middlware/not-found";
import { authRoutes } from "./auth/auth.route";

const app: Application = express()

app.use(cors({
    origin:config.app_url,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello World!")
})

app.use("/api/auth", authRoutes)


app.use(notFound)
app.use(globalErrorHandle)


export default app;

