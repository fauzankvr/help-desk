import React, { useState, useRef } from "react";

export default function HelpDesk() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! How can I help you today?" },
  ]);
  const inputRef = useRef();

  // Send message
  const sendMessage = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text }]);

    // Add bot reply
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: getBotReply(text) },
    ]);

    inputRef.current.value = "";
  };

  // Bot reply logic (demo)
  const getBotReply = (q) => {
    q = q.toLowerCase();
    if (q.includes("hello")) return "Hello! 👋 How can I assist?";
    if (q.includes("price")) return "Our pricing starts from $10/month.";
    if (q.includes("support"))
      return "You can reach support at support@example.com.";
    return "I'm not sure about that, but I’ll connect you with our team!";
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer hover:bg-blue-700"
      >
        💬
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg w-96 shadow-lg flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b">
              <h2 className="font-bold text-lg">Help Desk</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-sm max-w-[80%] ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t p-2">
              <input
                ref={inputRef}
                placeholder="Type your question..."
                className="flex-1 p-2 border rounded-l-lg outline-none text-sm"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 rounded-r-lg text-sm hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
