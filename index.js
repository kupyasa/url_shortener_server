import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shortLinkRouter from "./routes/shortlinks.js";

const app = express();
dotenv.config();
app.use(bodyParser.json({extented: true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text({extended:true}));
app.use(bodyParser.raw({extended:true}));


app.use(cors());

app.use("/shortlinks", shortLinkRouter);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`))
  )
  .catch((error) => console.log(error.message));
