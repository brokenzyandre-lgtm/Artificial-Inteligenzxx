/* style.css — Final, high-end futuristik */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Poppins:wght@300;400;500;600&display=swap');

:root {
  --bg: #0a0a18;
  --card-bg: rgba(20, 20, 40, 0.65);
  --text: #e6e6ff;
  --accent: #00f0ff;     /* cyan neon */
  --accent2: #ff00e6;   /* pink neon */
  --success: #00ffaa;
  --error: #ff3366;
  --gray: #777;
  --transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #0c0c22, #1a1a35, #0d0d26);
  background-size: 400% 400%;
  animation: gradientBG 18s ease infinite;
  color: var(--text);
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Partikel latar belakang */
#particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
}

/* Glassmorphism card */
.card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(100, 180, 255, 0.2);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.6),
    inset 0 0 12px rgba(80, 160, 255, 0.1);
  padding: 2.5rem;
  margin: 1.5rem auto;
  max-width: 800px;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--accent), var(--accent2), var(--accent));
  z-index: -1;
  border-radius: 22px;
  opacity: 0.4;
  animation: borderPulse 4s infinite alternate;
}

@keyframes borderPulse {
  0% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

h1, h2, h3, h4 {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}

h1 {
  font-size: 2.8rem;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
}

h2 {
  font-size: 2rem;
  color: var(--accent);
}

p {
  line-height: 1.7;
  color: #ccc;
  margin-bottom: 1rem;
}

.btn {
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  color: #000;
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  padding: 14px 36px;
  border-radius: 50px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0, 200, 255, 0.4),
    0 0 15px rgba(255, 0, 230, 0.2);
}

.btn:hover {
  transform: scale(1.05);
  box-shadow:
    0 6px 25px rgba(0, 200, 255, 0.7),
    0 0 25px rgba(255, 0, 230, 0.5);
}

.btn:active {
  transform: scale(0.98);
}

.btn.secondary {
  background: rgba(50, 50, 90, 0.6);
  color: var(--text);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn.secondary:hover {
  background: rgba(70, 70, 120, 0.7);
  border-color: var(--accent);
}

/* Input */
input[type="text"] {
  width: 100%;
  max-width: 400px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(30, 30, 60, 0.7);
  border: 1px solid var(--accent);
  color: var(--text);
  font-size: 1.1rem;
  text-align: center;
  margin: 1rem auto;
  display: block;
  transition: var(--transition);
}

input[type="text"]:focus {
  outline: none;
  border-color: var(--accent2);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
}

/* Progress & Timer */
.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  margin: 1.5rem 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--accent), var(--accent2));
  width: 0%;
  transition: width 0.6s ease;
  border-radius: 5px;
}

.timer-display {
  font-family: 'Orbitron', monospace;
  font-size: 1.4rem;
  color: #ff66cc;
  margin: 1rem 0;
  text-shadow: 0 0 8px rgba(255, 102, 204, 0.6);
}

/* Options */
.option {
  background: rgba(40, 40, 70, 0.7);
  border: 2px solid rgba(100, 150, 255, 0.2);
  color: var(--text);
  padding: 18px;
  margin: 0.8rem 0;
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: var(--transition);
  position: relative;
  font-size: 1.05rem;
}

.option:hover {
  border-color: var(--accent);
  transform: translateX(6px);
}

.option.selected {
  background: rgba(0, 220, 255, 0.12);
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(0, 220, 255, 0.3);
}

.option.correct {
  background: rgba(0, 255, 170, 0.15);
  border-color: var(--success);
  box-shadow: 0 0 15px rgba(0, 255, 170, 0.4);
}

.option.incorrect {
  background: rgba(255, 51, 102, 0.15);
  border-color: var(--error);
  box-shadow: 0 0 15px rgba(255, 51, 102, 0.4);
}

/* Certificate */
.certificate {
  width: 800px;
  max-width: 95%;
  margin: 2rem auto;
  background: linear-gradient(145deg, #0c1a33, #1a2a55);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  position: relative;
  box-shadow:
    0 0 40px rgba(0, 150, 255, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
}

.certificate::before {
  content: '★';
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  color: gold;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  font-family: serif;
}

.certificate h1 {
  font-size: 2.6rem;
  color: gold;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.7);
}

/* Model Design Grid */
.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.model-card {
  background: rgba(25, 25, 50, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  border: 1px solid rgba(120, 180, 255, 0.15);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.model-card:hover {
  transform: translateY(-10px);
  box-shadow:
    0 15px 35px rgba(0, 180, 255, 0.25),
    0 0 25px rgba(80, 200, 255, 0.15);
  border-color: rgba(0, 220, 255, 0.5);
}

.model-img {
  width: 100%;
  height: 340px;
  background: linear-gradient(135deg, #151530, #202045);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.model-img svg {
  width: 70%;
  max-width: 220px;
  opacity: 0.5;
  color: var(--accent);
}

.model-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(10, 10, 20, 0.9), transparent);
  padding: 1.3rem;
  text-align: left;
}

.model-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  margin: 0;
  color: #e0e0ff;
}

.model-tag {
  font-size: 0.85rem;
  color: var(--accent);
  margin-top: 0.3rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
}

.tag {
  background: rgba(0, 200, 255, 0.12);
  color: var(--accent);
  padding: 0.25rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Animasi */
.fade-in {
  animation: fadeIn 0.7s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .card { padding: 1.8rem; }
  h1 { font-size: 2.2rem; }
  .btn { padding: 12px 28px; font-size: 1rem; }
  .model-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  .model-img { height: 280px; }
}