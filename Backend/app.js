import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import userRoute from "./routes/user.js"
import DNSRoute from "./routes/DNS.js"
import cors from "cors";


config({path: './data/config.env'})
export const app=express()
app.use(express.json());
app.use(cookieParser());

app.use(cors({
   origin:'http://dns-management.vercel.app',
   methods:["GET","POST","PUT","DELETE"],
   credentials:true
 }));




app.use("/users", userRoute);
app.use("/dns", DNSRoute);



app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  
  
//  tHN9rxzEQSDhdpsj

// mongodb://0.0.0.0:27017
