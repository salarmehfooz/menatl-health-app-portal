import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  sendMessageToAI,
  clearChat,
  toggleChat,
  setInitialTherapistPrompt,
} from "../redux/chatBotSlice";

const ChatBot = () => {
  const dispatch = useDispatch();
  const { messages, status, isOpen } = useSelector((state) => state.chatBot);
  const [inputMessage, setInputMessage] = useState("");
  const chatMessagesRef = useRef(null);

  // Scroll to bottom on message change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Set initial therapist prompt
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      dispatch(setInitialTherapistPrompt());
    }
  }, [isOpen, messages.length, dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newMessage = { sender: "user", text: inputMessage };
    dispatch(addMessage(newMessage));
    setInputMessage("");

    const messagesForApi = [...messages, newMessage];
    dispatch(sendMessageToAI(messagesForApi));
  };

  const handleToggleChat = () => dispatch(toggleChat());
  const handleClearChat = () => dispatch(clearChat());

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 h-[400px] flex flex-col mt-4 border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">Therapist Bot</h3>
            <button
              onClick={handleClearChat}
              className="text-white text-sm px-2 py-1 rounded hover:bg-white hover:text-blue-600 transition-colors duration-200"
              aria-label="Clear Chat"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatMessagesRef}
            className="flex-1 p-4 overflow-y-auto custom-scrollbar"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg shadow-md ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {status === "loading" && (
              <div className="flex justify-start mb-2">
                <div className="max-w-[75%] px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200"
          >
            <div className="flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                disabled={status === "loading"}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
