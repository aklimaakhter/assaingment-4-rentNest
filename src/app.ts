import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewere/not-found";

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

app.use(notFound)


export default app;