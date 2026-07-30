import app from "./app"
import config from "./config";
import { prisma } from "./lib/prisma";


const PORT = config.port;

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully")

        if (config.node_env!== "production") {
            app.listen(config.port, () => {
                console.log(`server is running on http://localhost:${config.port}`);
            });
        }

        // app.listen(PORT, () => {
        //     console.log(`Server is running on port ${PORT}`)
        // })

    } catch (error) {
        console.log("Error starting the server:", error);
        await prisma.$disconnect();
        process.exit(1)
    }

}

main()

export default app;




// const PORT = Number(config.port || 5000);

// async function main() {
//   try {
//     await prisma.$connect();
//     console.log("🟢 Connected to the database successfully");

//     // প্রডাকশন (যেমন Vercel) বাদে লোকাল এনভায়রনমেন্টে পোর্ট লিসেন করবে
//     if (config.node_env !== "production") {
//       app.listen(PORT, () => {
//         console.log(`🚀 Server is running on http://localhost:${PORT}`);
//       });
//     }
//   } catch (error) {
//     console.error("❌ Error starting the server:", error);
//     await prisma.$disconnect();
//     process.exit(1);
//   }
// }

// main();

// // Vercel / Serverless Deployment-এর জন্য এক্সপোর্ট জরুরি
// export default app;