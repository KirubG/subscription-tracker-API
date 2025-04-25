import mongoose from "mongoose";
import {DB_URI, NODE_ENV} from "../config/env.js"

if(!DB_URI){
    throw new Error("Please set up your MongoDB_URL in the .env.(development/production).local file")
}

 const connectToDB = async () =>{
   try {
       await mongoose.connect(DB_URI)
       console.log(`connected to mongodb in ${NODE_ENV} mode`);
       
   } catch (error) {
      console.log("error in conection to mongodb", error);
      process.exit(1);
   }
}

export default connectToDB