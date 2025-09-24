import React from "react";
import { CloseIcon } from "./icons";

export function ChatHeader({ setOpen }) {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-t-xl">
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
  );
}
