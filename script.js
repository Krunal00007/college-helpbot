const chatWindow = document.getElementById("chatWindow");
window.addEventListener("DOMContentLoaded", () => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    savedHistory.forEach(({ sender, text }) => {
        addMessage(sender, text, true);
    });
});



const responses = {
    "hostel": "🏠 Hostel timing is 10:00 PM. Contact the warden for any issues.",
    "wi-fi": "📶 Wi-Fi is active 24/7. Contact the IT helpdesk for problems.",
    "fees": "💰 You can pay your fees online through the ERP portal.",
    "library": "📚 The library is open from 9 AM to 8 PM, Monday to Saturday.",
    "placement": "🎓 Placement updates are sent via your official university email."
};


function handleUserInput() {
    const inputField = document.getElementById("userInput");
    const rawInput = inputField.value.trim();
    const input = rawInput.toLowerCase();

    if (rawInput === "") {
        addMessage("Bot", "⚠️ Please enter a question before sending.");
        return;
    }

    addMessage("You", rawInput);

    let reply = "🤔 I'm not sure about that. Try asking about hostel, Wi-Fi, fees, library, or placement.";

    // 💬 Handle greetings
    if (["hi", "hello", "hey", "hii", "hola"].some(greet => input.includes(greet))) {
        // reply = "👋 Hello there! I’m College HelpBot. Ask me anything about your campus life — like fees, hostel, Wi-Fi, library, and more.";
        reply = `<span class="animate__animated animate__bounceIn">👋 Hello there!</span><br>I’m College HelpBot. Ask me anything about your campus life — like <strong>fees</strong>, <strong>hostel</strong>, <strong>Wi-Fi</strong>, <strong>library</strong> and more.`;
    } else {
        // 🔍 Search responses
        for (const key in responses) {
            if (input.includes(key)) {
                reply = responses[key];
                break;
            }
        }
    }

    // 🕐 Show loading message
    const loadingId = "loading";
    const loadingMsg = document.createElement("div");
    loadingMsg.id = loadingId;
    loadingMsg.className = "p-3 rounded-lg bg-gray-100 text-left mr-auto max-w-[80%] italic text-gray-500";
    loadingMsg.textContent = "🤖 Bot is typing...";
    chatWindow.appendChild(loadingMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
        document.getElementById(loadingId)?.remove();
        addMessage("Bot", reply);
    }, 1000);

    inputField.value = "";
}



function addMessage(sender, text, skipSave = false) {
    const message = document.createElement("div");
    message.classList = `p-3 rounded-lg ${sender === "You" ? "bg-indigo-100 text-right ml-auto max-w-[80%]" : "bg-gray-200 text-left mr-auto max-w-[80%]"
        }`;
    message.innerHTML = text;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (!skipSave) {
        const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
        history.push({ sender, text });
        localStorage.setItem("chatHistory", JSON.stringify(history));
    }
}



//"Enter" key press
document.getElementById("userInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleUserInput();
    }
});

function clearChat() {
    localStorage.removeItem("chatHistory");
    chatWindow.innerHTML = "";
}

function startVoice() {
    const micBtn = document.getElementById("micBtn");
    const micIcon = document.getElementById("micIcon");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        document.getElementById("voiceWarning").classList.remove("hidden");
        return;
    }


    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    // 🎤 Change icon + add animation
    micIcon.textContent = "🔴";
    micBtn.classList.add("animate-pulse", "bg-indigo-100", "text-indigo-700");

    recognition.onresult = function (event) {
        const speech = event.results[0][0].transcript;
        document.getElementById("userInput").value = speech;
        handleUserInput();
    };

    recognition.onerror = function (event) {
        alert("Voice error: " + event.error);
    };

    recognition.onend = function () {
        // 🛑 Restore original mic
        micIcon.textContent = "🎤";
        micBtn.classList.remove("animate-pulse", "bg-indigo-100", "text-indigo-700");
    };
}

