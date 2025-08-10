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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Set initial therapist greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      dispatch(setInitialTherapistPrompt());
    }
  }, [isOpen, messages.length, dispatch]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

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
      {/* Floating Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
          text-white font-bold py-3 px-4 rounded-full shadow-lg
          focus:outline-none focus:ring-4 focus:ring-purple-300
          transition-transform transform hover:scale-110"
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6
                 a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[420px] flex flex-col mt-4 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600
            text-white px-4 py-3 flex justify-between items-center"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🧠 Therapist Bot
            </h3>
            <button
              onClick={handleClearChat}
              className="text-white text-sm px-3 py-1 rounded-md bg-white/20
              hover:bg-white/30 transition-colors"
              aria-label="Clear Chat"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatMessagesRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-gray-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm
                  break-words transition-all ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {status === "loading" && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-white text-gray-800 border border-gray-200 animate-pulse">
                  ⌛ Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-200 bg-white"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message... "
                className="flex-1 p-2.5 border border-gray-300 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500
                  hover:from-blue-600 hover:to-purple-600 text-white p-2.5 rounded-full
                  shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                disabled={status === "loading"}
              >
                🚀
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
