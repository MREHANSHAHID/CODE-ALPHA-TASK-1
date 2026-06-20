import { useState } from "react";

const initialCards = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: "What is 12 × 12?", answer: "144" },
  { id: 3, question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare" },
  { id: 4, question: "What is the chemical symbol for water?", answer: "H₂O" },
  { id: 5, question: "What planet is known as the Red Planet?", answer: "Mars" },
];

export default function FlashcardApp() {
  const [cards, setCards] = useState(initialCards);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState("view"); // view | add | edit
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editId, setEditId] = useState(null);

  const card = cards[current];

  const next = () => { setFlipped(false); setTimeout(() => setCurrent((c) => (c + 1) % cards.length), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setCurrent((c) => (c - 1 + cards.length) % cards.length), 150); };

  const deleteCard = () => {
    const updated = cards.filter((_, i) => i !== current);
    setCards(updated);
    setCurrent(Math.min(current, updated.length - 1));
    setFlipped(false);
  };

  const saveCard = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    if (mode === "add") {
      const newCard = { id: Date.now(), ...form };
      setCards([...cards, newCard]);
      setCurrent(cards.length);
    } else {
      setCards(cards.map((c) => (c.id === editId ? { ...c, ...form } : c)));
    }
    setMode("view");
    setForm({ question: "", answer: "" });
    setFlipped(false);
  };

  const startEdit = () => {
    setForm({ question: card.question, answer: card.answer });
    setEditId(card.id);
    setMode("edit");
  };

  const style = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: "20px",
    },
    title: { color: "#fff", fontSize: "2.2rem", fontWeight: "bold", marginBottom: "8px", letterSpacing: "2px" },
    subtitle: { color: "#a78bfa", fontSize: "0.9rem", marginBottom: "36px", letterSpacing: "1px" },
    counter: { color: "#c4b5fd", marginBottom: "20px", fontSize: "0.95rem" },
    cardWrap: { perspective: "1000px", width: "380px", height: "240px", marginBottom: "28px", cursor: "pointer" },
    cardInner: {
      width: "100%", height: "100%", position: "relative",
      transition: "transform 0.5s cubic-bezier(.4,2,.6,1)",
      transformStyle: "preserve-3d",
      transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    },
    face: {
      position: "absolute", width: "100%", height: "100%",
      backfaceVisibility: "hidden", borderRadius: "18px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px", boxSizing: "border-box", textAlign: "center",
    },
    front: { background: "linear-gradient(135deg, #6d28d9, #4f46e5)", boxShadow: "0 20px 60px rgba(109,40,217,0.4)" },
    back: { background: "linear-gradient(135deg, #059669, #0d9488)", transform: "rotateY(180deg)", boxShadow: "0 20px 60px rgba(5,150,105,0.4)" },
    cardLabel: { color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" },
    cardText: { color: "#fff", fontSize: "1.25rem", lineHeight: "1.6" },
    hint: { color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", marginTop: "14px" },
    btnRow: { display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", justifyContent: "center" },
    btn: (bg, color = "#fff") => ({
      padding: "10px 22px", borderRadius: "30px", border: "none", cursor: "pointer",
      background: bg, color, fontWeight: "600", fontSize: "0.88rem",
      transition: "all 0.2s", letterSpacing: "0.5px",
    }),
    formBox: {
      background: "rgba(255,255,255,0.07)", borderRadius: "16px",
      padding: "24px", width: "380px", backdropFilter: "blur(12px)",
    },
    label: { color: "#c4b5fd", fontSize: "0.85rem", marginBottom: "6px", display: "block" },
    input: {
      width: "100%", padding: "10px 14px", borderRadius: "10px",
      border: "1px solid rgba(167,139,250,0.3)", background: "rgba(255,255,255,0.08)",
      color: "#fff", fontSize: "0.95rem", marginBottom: "14px", boxSizing: "border-box", outline: "none",
    },
  };

  return (
    <div style={style.app}>
      <div style={style.title}>🃏 FlashCards</div>
      <div style={style.subtitle}>TAP CARD TO FLIP • STUDY SMARTER</div>

      {mode === "view" && cards.length > 0 && (
        <>
          <div style={style.counter}>Card {current + 1} of {cards.length}</div>
          <div style={style.cardWrap} onClick={() => setFlipped(!flipped)}>
            <div style={style.cardInner}>
              <div style={{ ...style.face, ...style.front }}>
                <div style={style.cardLabel}>Question</div>
                <div style={style.cardText}>{card.question}</div>
                <div style={style.hint}>tap to reveal answer</div>
              </div>
              <div style={{ ...style.face, ...style.back }}>
                <div style={style.cardLabel}>Answer</div>
                <div style={style.cardText}>{card.answer}</div>
                <div style={style.hint}>tap to go back</div>
              </div>
            </div>
          </div>
          <div style={style.btnRow}>
            <button style={style.btn("#4f46e5")} onClick={prev}>← Prev</button>
            <button style={style.btn("#6d28d9")} onClick={() => setFlipped(!flipped)}>
              {flipped ? "Hide Answer" : "Show Answer"}
            </button>
            <button style={style.btn("#4f46e5")} onClick={next}>Next →</button>
          </div>
          <div style={style.btnRow}>
            <button style={style.btn("rgba(255,255,255,0.1)")} onClick={startEdit}>✏️ Edit</button>
            <button style={style.btn("rgba(239,68,68,0.3)")} onClick={deleteCard}>🗑 Delete</button>
            <button style={style.btn("rgba(5,150,105,0.4)")} onClick={() => { setMode("add"); setForm({ question: "", answer: "" }); }}>+ Add Card</button>
          </div>
        </>
      )}

      {cards.length === 0 && mode === "view" && (
        <div style={{ color: "#a78bfa", marginBottom: "24px", fontSize: "1.1rem" }}>
          No cards yet. Add one!
          <br />
          <button style={{ ...style.btn("#6d28d9"), marginTop: "16px" }} onClick={() => { setMode("add"); setForm({ question: "", answer: "" }); }}>+ Add Card</button>
        </div>
      )}

      {(mode === "add" || mode === "edit") && (
        <div style={style.formBox}>
          <div style={{ color: "#fff", fontWeight: "bold", marginBottom: "16px", fontSize: "1.1rem" }}>
            {mode === "add" ? "➕ New Flashcard" : "✏️ Edit Flashcard"}
          </div>
          <label style={style.label}>Question</label>
          <input style={style.input} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Enter question..." />
          <label style={style.label}>Answer</label>
          <input style={style.input} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Enter answer..." />
          <div style={style.btnRow}>
            <button style={style.btn("#6d28d9")} onClick={saveCard}>💾 Save</button>
            <button style={style.btn("rgba(255,255,255,0.1)")} onClick={() => setMode("view")}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
