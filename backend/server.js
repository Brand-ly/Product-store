import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { name } from "ejs";

import productRoutes from "./routes/productRoutes.js"
import sql from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app=express();
const port=process.env.PORT;

console.log(port);

app.use(express.json());//It reads the body of a request (like POST or PUT) and automatically parses it if it’s in JSON format.
app.use(cors());//a security feature built into web browsers that restricts web pages from making requests to a different domain than the one that served the web page.
app.use(helmet());//Help secure Express apps by setting HTTP response headers. 
app.use(morgan("dev"));//Morgan is an HTTP request logger middleware for Node.js, commonly used with Express.js applications. It simplifies the process of logging details about incoming HTTP requests and responses.

//apply arcjet rate-limit to all routes
app.use(async(req,res,next)=>{
    try {
        const decision= await aj.protect(req,{
            requested:1//specifies that each request consumes 1 token
        })

        if (decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({error:"Too many requests"});
            }
            else if(decision.reason.isBot()){
                res.status(403).json({error:"Bot access Denied"});
            }
            else{
                res.status(403).json({error:"Forbidden"});
            }
            return
        }
        //check for spoofed bots
        if(decision.results.some((result)=>result.reason.isBot()&& result.reason.isSpoofed())){
            res.status(403).json({error:"Spoofed Bot detected"});
            return;
        }
    } catch (error) {
        console.log("Arcjet error", error);
        next(error);
    }
})

app.use("/api/products", productRoutes);

async function initDB() {
    try{
        await sql`
        CREATE TABLE IF NOT EXISTS products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
        `;
    console.log("Table created or already exists.");
    }catch(error){
        console.log("Error initDB", error);
    }
    
}

initDB().then(()=>{
    app.listen(port, ()=>{
        console.log("Server is running on port " + port);
    });
})
