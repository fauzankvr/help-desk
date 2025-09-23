import React, { useEffect, useRef, useState } from "react";

export default function HelpDesk() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! How can I help you today?" },
  ]);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Effect to scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect to focus input when chat opens
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const sendMessage = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text }]);

    // Simulate bot thinking and then reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: getBotReply(text) },
      ]);
    }, 1000);

    inputRef.current.value = "";
  };

  // Simple bot reply logic
  const getBotReply = (q) => {
    const lowerCaseQ = q.toLowerCase();
    if (lowerCaseQ.includes("hello") || lowerCaseQ.includes("hi")) {
      return "Hello! 👋 How can I assist you?";
    }
    if (lowerCaseQ.includes("price") || lowerCaseQ.includes("pricing")) {
      return "Our pricing starts from $10/month for the basic plan.";
    }
    if (lowerCaseQ.includes("support") || lowerCaseQ.includes("help")) {
      return "You can reach our support team at support@example.com or call us at 1-800-123-4567.";
    }
    if (lowerCaseQ.includes("code has expired")) {
      return "Sure! Choose the 'request new code' option. Then check your email or phone messages.";
    }
    return "I'm not sure how to answer that, but I can connect you with a human agent if you'd like.";
  };

  // SVG Icon Components
  const ChatIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  const CloseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const SendIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 transition-all duration-300 ease-in-out ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-[calc(100vw-40px)] sm:w-96 flex flex-col h-[70vh] max-h-[600px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4  bg-gray-50 rounded-t-xl">
            <div className="flex items-center space-x-2">
              <div className="bg-green-600 p-2 rounded-full text-white">
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
              <h2 className="font-bold text-lg text-gray-800">Help Desk</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-200">
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
                      : "bg-green-500 text-white"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.from === "bot" && (
                    <p className="text-xs text-green-200 mt-2 opacity-80 flex items-center">
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

          {/* Input */}
          <div className=" p-3 bg-white rounded-b-xl">
            <div className="flex items-center bg-gray-100 rounded-lg">
              <input
                ref={inputRef}
                placeholder="Type your message..."
                className="flex-1 p-3 bg-transparent rounded-l-lg outline-none text-sm text-gray-700"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 text-white p-3 rounded-r-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-16 h-16 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center text-2xl cursor-pointer hover:bg-green-600 transition-all duration-300 ease-in-out ${
          open ? "opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
        aria-label="Open chat"
      >
        <ChatIcon />
      </button>
    </>
  );
}
