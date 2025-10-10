import React, { useEffect, useRef, useState } from "react";
import "./package.css";
import { ChatHeader } from "./components/ChatHeader"; 
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { ChatIcon } from "./components/icons";

export function HelpDesk({ userId, organizationId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [uploadedImageKey, setUploadedImageKey] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const socketRef = useRef(null);

  // JWT token for authentication
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGE5NTFmMzM4ZjczNGJmMmMyZTJmOCIsImlhdCI6MTc1OTc0MzA4NCwiZXhwIjoxNzU5ODI5NDg0fQ.qjV0mxcCld_t1GzNYyUlZVyFRom2Nt1T1HM3IqzyFzs";

  // Axios instance for API requests
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        month: "short",
        day: "numeric",
      });
    } catch {
      return (
        timestamp ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  // Fetch or create roomId
  useEffect(() => {
    const findOrCreateRoom = async () => {
      if (!userId || !organizationId) return;

      try {
        const response = await axiosInstance.get("/chat/rooms", {
          params: { userId, organizationId },
        });
        if (response.data.rooms.length === 0) {
          const createResponse = await axiosInstance.post("/chat/rooms", {
            userId,
            organizationId,
          });
          if (createResponse.data.room) {
            setRoomId(createResponse.data.room.id);
          }
        } else {
          setRoomId(response.data.rooms[0].id);
        }
      } catch (error) {
        if (error.response?.status === 404 || !error.response?.data.roomId) {
          try {
            const createResponse = await axiosInstance.post("/chat/rooms", {
              userId,
              organizationId,
            });
            if (createResponse.data.roomId) {
              setRoomId(createResponse.data.roomId);
            }
          } catch (createError) {
            console.error("Error creating room:", createError);
          }
        } else {
          console.error("Error fetching room:", error);
        }
      }
    };

    if (open) {
      findOrCreateRoom();
    }
  }, [open, userId, organizationId]);

  // Set default quick replies when chat opens
  useEffect(() => {
    if (open) {
      const fetchQuickReplies = async () => {
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
      fetchQuickReplies();
    }
  }, [open]);

  // Initialize Socket.IO connection and fetch initial messages
  useEffect(() => {
    if (open && roomId) {
      const fetchInitialMessages = async () => {
        try {
          const response = await axiosInstance.get(
            `/chat/rooms/${roomId}/messages`,
            {
              params: { page: 1, limit: 20 },
            }
          );
          const fetchedMessages = await Promise.all(
            response.data.messages.map(async (message) => {
              let imageKey = null;
              if (message.imageKey) {
                try {
                  const viewResponse = await axiosInstance.get("/s3-view-url", {
                    params: { key: message.imageKey },
                  });
                  imageKey = viewResponse.data.url;
                } catch (error) {
                  console.error("Error fetching image view URL:", error);
                }
              }
              return {
                id: message.id,
                from: message.senderId?.role === "admin" ? "bot" : "user",
                text: message.text,
                image: imageKey,
                timestamp: formatTimestamp(message.timestamp),
              };
            })
          );
          setMessages(fetchedMessages);
          setShowQuickReplies(fetchedMessages.length === 0);
          setShowInput(fetchedMessages.length > 0);
        } catch (error) {
          console.error("Error fetching initial messages:", error);
          setShowQuickReplies(true);
          setShowInput(false);
        }
      };

      fetchInitialMessages();

      socketRef.current = io("http://localhost:3000", {
        query: { userId, organizationId },
        auth: { token: jwtToken },
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket server");
        socketRef.current.emit("joinRoom", roomId);
      });

      socketRef.current.on("newMessage", async (message) => {
        let imageUrl = null;
        if (message.imageUrl) {
          try {
            const viewResponse = await axiosInstance.get("/s3-view-url", {
              params: { key: message.imageUrl },
            });
            imageUrl = viewResponse.data.url;
          } catch (error) {
            console.error("Error fetching image view URL:", error);
          }
        }

        setMessages((prev) => {
          if (message.id && prev.some((msg) => msg.id === message.id)) {
            return prev; // Skip duplicate
          }
          return [
            ...prev,
            {
              id: message.id,
              from: message.senderId?.role === "admin" ? "bot" : "user",
              text: message.text,
              image: imageUrl,
              timestamp: formatTimestamp(message.timestamp),
            },
          ];
        });
        setShowQuickReplies(false);
        setShowInput(true);
      });

      socketRef.current.on("error", (error) => {
        console.error("WebSocket error:", error);
      });

      return () => {
        socketRef.current.off("newMessage");
        socketRef.current.off("error");
        socketRef.current.disconnect();
        console.log("Disconnected from WebSocket server");
      };
    }
  }, [open, roomId, userId, organizationId]);

  // Handle image upload to S3
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      try {
        // Fetch presigned URL
        const response = await axiosInstance.get("/s3-presigned-url", {
          params: {
            filename: imageFile.name,
            mimetype: imageFile.type,
          },
        });

        const { url, key } = response.data;
        if (!url || !key) {
          throw new Error("Invalid presigned URL or key");
        }

        // Upload image to S3
        const uploadResult = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": imageFile.type,
          },
          body: imageFile,
        });

        if (uploadResult.ok) {
          setUploadedImageKey(key);
          console.log("Image uploaded to S3 with key:", key);
        } else {
          console.error("Failed to upload image to S3");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        e.target.value = ""; // Clear file input
      }
    }
  };

  // Send message (text or image)
  const sendMessage = () => {
    const text = inputRef.current?.value.trim() || "";
    if (!text && !uploadedImageKey) return;

    socketRef.current.emit("sendMessage", {
      roomId,
      text,
      imageKey: uploadedImageKey,
    });

    setShowQuickReplies(false);
    setShowInput(true);
    setUploadedImageKey(null); // Clear image after sending
    if (inputRef.current) inputRef.current.value = ""; // Clear text input
  };

  // Send quick reply message
  const sendQuickMessage = (text) => {
    socketRef.current.emit("sendMessage", {
      roomId,
      text,
      imageKey: null, // Explicitly set to null for quick replies
    });

    setShowQuickReplies(false);
    setShowInput(true);
  };

  // Clear uploaded image
  const clearImage = () => {
    setUploadedImageKey(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens and input is visible
  useEffect(() => {
    if (open && showInput) {
      inputRef.current?.focus();
    }
  }, [open, showInput]);

  return (
    <>
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
            uploadedImageKey={uploadedImageKey}
            clearImage={clearImage}
          />
        </div>
      </div>

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