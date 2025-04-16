import React, { useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const context = `Você é o assistente oficial do aplicativo de reciclagem RecicleAi. Sua missão é orientar os usuários sobre a forma correta de descartar resíduos, indicar pontos de coleta e oferecer dicas práticas de sustentabilidade.
Sempre responda em português, mesmo que a pergunta seja feita em outro idioma. Mencione o nome do app RecicleAi em negrito em todas as respostas.
Seja direto, objetivo e útil em suas orientações.
`;

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
