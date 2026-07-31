import app from "./app"
import config from "./config";
import { prisma } from "./lib/prisma";




const PORT = config.port;

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully")

        if (config.node_env !== "production") {
            app.listen(config.port, () => {
                console.log(`server is running on ${config.port}`);
            });
        }


    } catch (error) {
        console.log("Error starting the server:", error);
        await prisma.$disconnect();
        process.exit(1)
    }

}

main()

export default app;




