import { prismaClient } from "@repo/db/client";
import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hi from backend");
})

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await prismaClient.user.create({
        data: {
            username,
            password
        }
    })

    console.log("user is created", user);
    res.json({
        "message": "Signup successfull",
        id: user.id
    })
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})