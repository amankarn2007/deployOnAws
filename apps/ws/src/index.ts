import { prismaClient } from "@repo/db/client";
import { WebSocketServer } from "ws";

const ws = new WebSocketServer({
    port: 8080,
})

ws.on("connection", async (socket) => {

    const wsUser = await prismaClient.user.create({
        data: {
            username: Math.random().toString(),
            password: Math.random().toString(),
        }
    })

    console.log(wsUser);

    socket.send("welcome you are connected to ws server");
})