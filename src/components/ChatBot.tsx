import React, { useState } from "react";
import { AiOutlineMessage, AiOutlineClose } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API Key
const API_KEY = "AIzaSyBMu2KY7aJsoNa6tHRu7AZcWyP5LOqanug";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);
  const handleClearMessages = () => setMessages([]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await model.generateContent(`Reply in a short and concise way: ${input}`);
      const aiResponse = await result.response.text();

      const botMessage = { sender: "bot", text: aiResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't process that." }]);
    }

    setInput("");
  };

  return (
    <div>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-health-500 text-white p-4 rounded-full shadow-lg hover:bg-health-600 transition"
        >
          <AiOutlineMessage size={24} />
        </button>
      )}

      {/* Chat Container */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white w-80 h-[400px] shadow-lg rounded-lg flex flex-col border border-gray-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-health-500 text-white p-3 rounded-t-lg">
            <span className="text-sm font-semibold">FemmeCare AI Chat</span>
            <div className="flex gap-2">
              <button onClick={handleClearMessages} className="text-white hover:text-gray-200">
                <FiTrash2 size={18} />
              </button>
              <button onClick={toggleChat} className="text-white hover:text-gray-200">
                <AiOutlineClose size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto text-xs">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">Start the conversation!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 rounded-md max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-black self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t flex">
            <input
              type="text"
              className="flex-1 border rounded-md p-2 text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-health-500 text-white px-3 py-2 rounded-md hover:bg-health-600 text-xs"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
