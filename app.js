const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Menambahkan pesan ke chat
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

// Menampilkan teks per huruf (typing effect)
async function typeMessage(element, text) {
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await new Promise(r => setTimeout(r, 20)); // kecepatan typing
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Mengirim pesan ke AI
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const aiMsgElem = addMessage("AI sedang mengetik...", "ai");

    const messages = [{role: "user", content: text}];

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "DeepSeek-R1",
                messages: messages
            })
        });

        const data = await response.json();
        const aiMsg = data.choices[0].message.content;

        aiMsgElem.textContent = "";
        await typeMessage(aiMsgElem, aiMsg);

    } catch (err) {
        aiMsgElem.textContent = "Terjadi error, coba lagi.";
        console.error(err);
    }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
