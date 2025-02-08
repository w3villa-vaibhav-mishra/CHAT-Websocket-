const express = require("express");
const WebSocket = require("ws");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// Create an HTTP server
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const GROQ_API_KEY = "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"; 
// In-memory chat history for the session
let chatHistory = [];

// WebSocket Connection Handling
wss.on("connection", (ws) => {
    console.log("Client connected");

    // Send chat history to the client when they connect
    ws.send(JSON.stringify({ history: chatHistory }));

    ws.on("message", async (message) => {
        console.log("Received:", message);

        // Store the user's message in the history
        chatHistory.push({ role: "user", content: message.toString() });

        // Get Groq bot response
        const botResponse = await getGroqResponse(message.toString());

        // Store the bot's response in the history
        chatHistory.push({ role: "assistant", content: botResponse });

        // Send both the history and bot's response back to client
        ws.send(JSON.stringify({ type: 'message', content: botResponse }));
    });

    ws.on("close", () => console.log("Client disconnected"));
});

// Function to call Groq API
async function getGroqResponse(userMessage) {
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions", // ✅ Corrected URL
            {
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: userMessage }],
            },
            {
                headers: {
                    "Authorization": `Bearer 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`, // Replace this
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Groq API Response:", response.data);
        return response.data.choices?.[0]?.message?.content || "Error: No response from bot.";
    } catch (error) {
        console.error("❌ Groq API Error:", error.response?.data || error.message);
        return `Error: ${JSON.stringify(error.response?.data)}`;
    }
}

// Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
