import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { globalErrorHandle } from "./middleware/global-error";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/categories/categorie.routes";
import { propertyRoutes } from "./modules/properties/properties.routes";
import { notFound } from "./middleware/not-found";
import { rentalRoutes } from "./modules/rentalRequest/rental.routes";
import { reviewRoutes } from "./modules/reviwes/review.routes";
import { adminRoutes } from "./modules/admin/admin.routes";

const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
})

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", propertyRoutes);
app.use("/api", rentalRoutes);
app.use("/api", reviewRoutes);
app.use("/api", adminRoutes);


app.use(notFound)
app.use(globalErrorHandle)


export default app;

