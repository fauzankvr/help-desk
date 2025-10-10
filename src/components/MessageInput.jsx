import React from "react";

export const MessageInput = ({
  inputRef,
  sendMessage,
  handleImageChange,
  imageInputRef,
  sendQuickMessage,
  showQuickReplies,
  showInput,
  quickReplies,
  uploadedImageKey,
  clearImage,
}) => (
  <div className="p-3 bg-white border-t border-gray-200">
    {showQuickReplies && (
      <div className="flex flex-wrap gap-2 mb-2">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => sendQuickMessage(reply)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>
    )}
    {showInput && (
      <div className="relative flex items-start gap-2">
        <button
          onClick={() => imageInputRef.current?.click()}
          className="p-1 rounded-full text-green-500 hover:bg-green-100 transition-colors"
          aria-label="Upload image"
        >
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={imageInputRef}
          aria-hidden="true"
        />
        <textarea
          ref={inputRef}
          onChange={(e) => (inputRef.current.value = e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none min-h-[40px] max-h-[120px]"
          aria-label="Type a message"
        />
        <button
          onClick={sendMessage}
          className="absolute right-2 top-2 p-1 rounded-full text-green-500 hover:bg-green-100 transition-colors"
          aria-label="Send message"
        >
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
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </div>
    )}
    {uploadedImageKey && (
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-gray-600">
          Image uploaded: {uploadedImageKey.split("/").pop()}
        </span>
        <button
          onClick={clearImage}
          className="text-xs text-red-500 hover:text-red-600"
          aria-label="Remove uploaded image"
        >
          Remove
        </button>
      </div>
    )}
  </div>
);
