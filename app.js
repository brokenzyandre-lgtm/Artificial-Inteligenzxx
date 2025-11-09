const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    userInput.value = "";
    addMessage("AI sedang mengetik...", "ai");

    const messages = [
        {role: "user", content: text}
    ];

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "DeepSeek-v3",
                messages: messages
            })
        });

        const data = await response.json();
        const aiMsg = data.choices[0].message.content;

        chatBox.removeChild(chatBox.lastChild);
        addMessage(aiMsg, "ai");

    } catch (err) {
        chatBox.removeChild(chatBox.lastChild);
        addMessage("Terjadi error, coba lagi.", "ai");
        console.error(err);
    }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});