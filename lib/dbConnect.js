import mongoose from "mongoose";
 // Load environment variables from a .env file into process.env
export const connect = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("DB already connected");
            return;
            
        } else {
            await mongoose.connect("mongodb+srv://anasanas21332:cMXypXuzUhKJwI68@cluster0.s0jrryh.mongodb.net/ecommerce?retryWrites=true&w=majority");
            console.log("Connected to MongoDB");
        }

    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        
    }
};