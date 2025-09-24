import React from "react";
import { PlusIcon, SendIcon } from "./Icons";

export function MessageInput({
  inputRef,
  sendMessage,
  handleImageChange,
  imageInputRef,
  sendQuickMessage,
  showQuickReplies,
  showInput,
  quickReplies,
}) {
  return (
    <div className="p-3 bg-white rounded-b-xl">
      {/* Quick Reply Buttons */}
      {showQuickReplies && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickReplies.map((text, index) => (
            <button
              key={index}
              onClick={() => sendQuickMessage(text)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
              aria-label={`Send ${text} message`}
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input Area (Text Input, Image Upload, Send Button) */}
      {showInput && (
        <div className="flex items-center bg-gray-100 rounded-full">
          {/* Hidden File Input for Images */}
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            aria-label="Upload image"
          />

          {/* Plus Button to Trigger File Input */}
          <button
            onClick={() => imageInputRef.current.click()}
            className="p-3 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Add an image"
          >
            <PlusIcon />
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-transparent rounded-b-full outline-none text-sm text-gray-700"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors disabled:bg-green-300"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      )}
    </div>
  );
}
