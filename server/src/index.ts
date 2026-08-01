import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import userRoutes from './routes/user.js'
import aiRoutes from './routes/ai.js'
import cors from 'cors'
import axios from 'axios';

const url = `https://career-ai-1xha.onrender.com`;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);


dotenv.config();

await connectDB();
const app = express();
app.use(cors());

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));

app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
