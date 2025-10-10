import React from "react";

export const MessageList = ({ messages, messagesEndRef }) => (
  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id || msg.timestamp} // Use message ID if available, fallback to timestamp
          className={`flex flex-col gap-1 ${
            msg.from === "user" ? "items-end ml-auto" : "items-start"
          }`}
        >
          <div
            className={`max-w-xs p-2 rounded-xl ${
              msg.from === "user"
                ? "bg-green-500 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
            }`}
          >
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded"
                className="max-w-[150px] rounded-lg mb-1 object-cover"
                onError={(e) => (e.target.src = null)} // Fallback if image fails to load
              />
            )}
            <p
              className="text-sm whitespace-pre-wrap overflow-wrap-anywhere"
              style={{ maxWidth: "100%" }}
            >
              {msg.text}
            </p>
            <p
              className={`text-xs mt-1 ${
                msg.from === "user" ? "text-gray-100" : "text-gray-400"
              }`}
            >
              {msg.timestamp}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  </div>
);