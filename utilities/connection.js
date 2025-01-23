const mongoose = require('mongoose')
const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbname: process.env.DBNAME,
        };
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Connected successfully to the database.");
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;