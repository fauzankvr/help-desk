export function initHelpDesk() {
  // Floating button
  const button = document.createElement("button");
  button.innerHTML = "💬";
  button.className =
    "fixed bottom-5 right-5 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer hover:bg-blue-700";
  document.body.appendChild(button);

  // Modal
  const modal = document.createElement("div");
  modal.className =
    "hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50";
  modal.innerHTML = `
    <div class="bg-white rounded-lg w-96 shadow-lg flex flex-col max-h-[80vh]">
      
      <!-- Header -->
      <div class="flex justify-between items-center p-3 border-b">
        <h2 class="font-bold text-lg">Help Desk</h2>
        <button id="closeHelpDesk" class="text-gray-500 hover:text-red-500">✕</button>
      </div>

      <!-- Messages -->
      <div id="helpdeskMessages" class="flex-1 overflow-y-auto p-3 space-y-2">
        <div class="p-2 bg-gray-200 rounded-lg text-sm text-gray-700">
          👋 Hi! How can I help you today?
        </div>
      </div>

      <!-- Input -->
      <div class="flex border-t p-2">
        <input id="helpdeskInput" 
          placeholder="Type your question..."
          class="flex-1 p-2 border rounded-l-lg outline-none text-sm" />
        <button id="helpdeskSend" 
          class="bg-blue-600 text-white px-4 rounded-r-lg text-sm hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // DOM elements
  const closeBtn = modal.querySelector("#closeHelpDesk");
  const messages = modal.querySelector("#helpdeskMessages");
  const input = modal.querySelector("#helpdeskInput");
  const sendBtn = modal.querySelector("#helpdeskSend");

  // Open modal
  button.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Send message function
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.className =
      "p-2 bg-blue-600 text-white rounded-lg text-sm ml-auto max-w-[80%]";
    userMsg.innerText = text;
    messages.appendChild(userMsg);

    // Auto bot response (demo)
    const botMsg = document.createElement("div");
    botMsg.className =
      "p-2 bg-gray-200 text-gray-700 rounded-lg text-sm max-w-[80%]";
    botMsg.innerText = getBotReply(text);
    messages.appendChild(botMsg);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;
  }

  // Demo response logic (replace with API later)
  function getBotReply(q) {
    q = q.toLowerCase();
    if (q.includes("hello")) return "Hello! 👋 How can I assist?";
    if (q.includes("price")) return "Our pricing starts from $10/month.";
    if (q.includes("support"))
      return "You can reach support at support@example.com.";
    return "I'm not sure about that, but I’ll connect you with our team!";
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}
