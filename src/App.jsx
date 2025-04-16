import React, { useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const context =
    "Você é um assistente de um aplicativo de reciclagem chamado RecicleAi. Ajude as pessoas a reciclar corretamente, indicando como descartar itens, locais de coleta e dicas sustentáveis. Você é responsavel por ajudar os usuário do app RecicleAi com instruções e informações sobre reciclagem. Responda em portugues, não use ingles. Se o usuário falar em ingles, responda em portugues. Coloque o nome do app RecicleAi em negrito. Sempre seja o mais objetivo possivel";

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { type: "user", text: prompt }];
    setMessages(newMessages);
    setPrompt("");

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDhP66N4BNsUS_mBppOtkvYdH4o4LMrpIQ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: context }, { text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Não consegui entender. Pode reformular?";

      setMessages([...newMessages, { type: "bot", text }]);
    } catch (error) {
      console.error("Erro ao chamar Gemini:", error);
      setMessages([
        ...newMessages,
        { type: "bot", text: "Erro ao chamar Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        ♻️ RecicleAi - Assistente de Reciclagem
      </header>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.type === "user" ? "user" : "bot"}`}>
            {msg.text}
          </div>
        ))}

        {loading && <div className="chat-message bot">Digitando...</div>}
      </div>

      <div className="chat-input-area">
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Digite sua dúvida..."
        />
        <button onClick={handleSubmit} disabled={loading}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;
