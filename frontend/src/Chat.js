import React, { useState } from "react";
import useWebSocket from "react-use-websocket";

const SOCKET_URL = "ws://localhost:5000"; // WebSocket backend URL

const Chat = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [showHistory, setShowHistory] = useState(false); // Toggle chat history visibility

    const { sendMessage, lastMessage } = useWebSocket(SOCKET_URL, {
        onOpen: () => console.log("Connected to WebSocket"),
        onMessage: (event) => {
            // Parsing the JSON response from backend and setting the message in chat state
            const response = JSON.parse(event.data);
            setChat((prevChat) => [...prevChat, { sender: "bot", text: response.message }]);
        },
    });

    const handleSendMessage = () => {
        if (message.trim()) {
            setChat((prevChat) => [...prevChat, { sender: "user", text: message }]);
            sendMessage(message);
            setMessage("");
        }
    };

    const toggleHistory = () => setShowHistory((prev) => !prev);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Hamburger icon to toggle history */}
            <div
                onClick={toggleHistory}
                style={{
                    cursor: "pointer",
                    padding: "10px",
                    backgroundColor: "#333",
                    color: "#fff",
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    borderRadius: "50%",
                    zIndex: "1000",
                }}
            >
                History
            </div>

            {/* Chat History Sidebar */}
            {showHistory && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        right: "0",
                        width: "300px",
                        height: "100vh",
                        backgroundColor: "#f4f4f4",
                        borderLeft: "1px solid #ddd",
                        padding: "10px",
                        boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
                        overflowY: "auto",
                        zIndex: "1000",
                    }}
                >
                    <h3>Chat History</h3>
                    <div style={{ maxHeight: "80vh", overflowY: "scroll" }}>
                        {chat.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign: msg.sender === "user" ? "right" : "left",
                                    padding: "5px",
                                }}
                            >
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Chat UI */}
            <div
                style={{
                    maxWidth: "500px",
                    margin: "auto",
                    textAlign: "center",
                    padding: "10px",
                    flex: 1,
                    marginLeft: showHistory ? "300px" : "0", // Adjust layout when history is visible
                }}
            >
                <h2>WebSocket Chat</h2>
                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        height: "300px",
                        overflowY: "scroll",
                        marginBottom: "10px",
                    }}
                >
                    {chat.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                textAlign: msg.sender === "user" ? "right" : "left",
                                padding: "5px",
                            }}
                        >
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{ padding: "8px", width: "80%" }}
                    />
                    <button
                        onClick={handleSendMessage}
                        style={{
                            padding: "8px",
                            marginLeft: "10px",
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
