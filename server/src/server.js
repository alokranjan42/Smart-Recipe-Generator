 import dotenv from "dotenv";
import { app } from "./app.js";
import dbConnect from "./db/db.js";

dotenv.config();

const PORT = 8005;

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error occurred while running server", error);
  });
