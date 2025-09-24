import React, { useEffect, useRef, useState } from "react";
import "./package.css";
import { ChatHeader } from "./components/ChatHeader"; 
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { ChatIcon } from "./components/Icons";

export default function HelpDesk() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  // Simulate fetching quick replies from backend
  useEffect(() => {
    const fetchQuickReplies = async () => {
      // Mock API call
      const response = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              "What is the pricing?",
              "How do I get support?",
              "What if my code expired?",
            ]),
          500
        )
      );
      setQuickReplies(response);
    };

    if (open) {
      fetchQuickReplies();
    }
  }, [open]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      setMessages((prev) => [
        ...prev,
        {
          from: "user",
          image: imageUrl,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      // Simulate bot response to image
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Thanks for sharing the image! How can I assist you further?",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 1000);

      // Hide quick replies and show input after image upload
      setShowQuickReplies(false);
      setShowInput(true);

      // Reset file input
      e.target.value = "";
    }
  };

  // Effect to scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect to focus input when chat opens and input is visible
  useEffect(() => {
    if (open && showInput) {
      inputRef.current?.focus();
    }
  }, [open, showInput]);

  const sendMessage = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        from: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    // Simulate bot thinking and then reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: getBotReply(text),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);

    // Ensure quick replies are hidden and input is shown
    setShowQuickReplies(false);
    setShowInput(true);

    inputRef.current.value = "";
  };

  const sendQuickMessage = (text) => {
    // Add user message from quick reply
    setMessages((prev) => [
      ...prev,
      {
        from: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    // Simulate bot thinking and then reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: getBotReply(text),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);

    // Hide quick replies and show input after button click
    setShowQuickReplies(false);
    setShowInput(true);
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
    if (
      lowerCaseQ.includes("code expired") ||
      lowerCaseQ.includes("code has expired")
    ) {
      return "Sure! Choose the 'request new code' option. Then check your email or phone messages.";
    }
    return "I'm not sure how to answer that, but I can connect you with a human agent if you'd like.";
  };

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
          <ChatHeader setOpen={setOpen} />
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
          <MessageInput
            inputRef={inputRef}
            sendMessage={sendMessage}
            handleImageChange={handleImageChange}
            imageInputRef={imageInputRef}
            sendQuickMessage={sendQuickMessage}
            showQuickReplies={showQuickReplies}
            showInput={showInput}
            quickReplies={quickReplies}
          />
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
