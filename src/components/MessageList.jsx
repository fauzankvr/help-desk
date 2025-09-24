import React from "react";

export function MessageList({ messages, messagesEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 space-y-4 bg-gray-200">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.from === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {msg.from === "user" && (
            <img
              src="https://placehold.co/40x40/E2E8F0/4A5568?text=U"
              alt="user"
              className="w-8 h-8 rounded-full ml-2 order-2"
            />
          )}
          {msg.from === "bot" && (
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mr-2 order-1 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6V2H8v4H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2Z"></path>
                <path d="M12 18a2 2 0 0 0-2-2h-2v4h4v-2Z"></path>
                <path d="m18 12-2-2-2 2"></path>
                <path d="m16 14 2 2 2-2"></path>
              </svg>
            </div>
          )}
          <div
            className={`p-3 rounded-lg max-w-[80%] order-1 ${
              msg.from === "user"
                ? "bg-white text-gray-800 shadow-sm"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {msg.text && <p className="text-sm">{msg.text}</p>}
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded content"
                className="mt-2 max-w-[200px] rounded-lg"
              />
            )}
            <p className="text-[9px] text-gray-500 mt-1">{msg.timestamp}</p>
            {msg.from === "bot" && (
              <p className="text-xs text-blue-500 mt-2 opacity-80 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.9 4.2-4.6.7 3.3 3.2-.8 4.6L12 13l4.1 2.2-.8-4.6 3.3-3.2-4.6-.7L12 3z" />
                </svg>
                Answered by AI
              </p>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
