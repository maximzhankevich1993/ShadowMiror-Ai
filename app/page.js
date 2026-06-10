"use client";
import { useState, useEffect } from "react";
import AuraBackground from "../components/AuraBackground";
import SmokeLoader from "../components/SmokeLoader";

const QUEST_QUESTIONS = [
  {
    id: 1,
    text: "You wander deep inside a conceptual labyrinth and find a locked monolithic mirror. What reflects inside before you even touch it?",
    options: [
      { text: "A distorted, terrifying silhouette of everything I suppress.", score: { archetype: "Shadow", weight: 3 } },
      { text: "An ancient keeper of records holding an open grimoire.", score: { archetype: "Sage", weight: 3 } },
      { text: "A vast, pitch-black celestial void expanding infinitely.", score: { archetype: "Hermit", weight: 3 } }
    ]
  },
  {
    id: 2,
    text: "When an external authority or environment inflicts systemic injustice upon you, your primitive internal reaction is:",
    options: [
      { text: "Total scorched-earth retaliation. Dismantle their entire matrix.", score: { archetype: "Rebel", weight: 3 } },
      { text: "Adopt a freezing mask of apathy while mapping out their fatal flaw.", score: { archetype: "Mask", weight: 3 } },
      { text: "An immediate turn inward, dissecting my own structural weakness.", score: { archetype: "Shadow", weight: 2 } }
    ]
  },
  {
    id: 3,
    text: "If your absolute darkest vice, secret obsession, or taboo impulse materialized as an independent entity, it manifests as:",
    options: [
      { text: "A chaotic, mocking Jester ridiculing all human laws.", score: { archetype: "Trickster", weight: 3 } },
      { text: "A cold Sovereign sitting on a throne of absolute compliance.", score: { archetype: "Ruler", weight: 3 } },
      { text: "A formless, adaptive mist that evades any cognitive chains.", score: { archetype: "Shadow", weight: 4 } }
    ]
  }
];

export default function ShadowMirrorHome() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1-3: Questions, 4: Result
  const [answers, setAnswers] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Автономность: Проверяем URL на session_id из AuraAI, затем localStorage, если пусто — генерируем свой
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("session_id");
    
    if (!id) id = localStorage.getItem("aura_session_id");
    if (!id) id = "_" + Math.random().toString(36).substr(2, 9);
    
    setSessionId(id);
    localStorage.setItem("aura_session_id", id);
  }, []);

  const handleOptionSelect = (score) => {
    const updatedAnswers = [...answers, score];
    setAnswers(updatedAnswers);

    if (currentStep < QUEST_QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const processMetrics = async () => {
    setIsAnalyzing(true);

    // Рассчитываем доминирующий архетип по весам
    const scoreMap = {};
    answers.forEach(ans => { 
      scoreMap[ans.archetype] = (scoreMap[ans.archetype] || 0) + ans.weight; 
    });
    const primaryArchetype = Object.keys(scoreMap).reduce((a, b) => scoreMap[a] > scoreMap[b] ? a : b);
    const shadowLevel = Math.floor(Math.random() * 30) + 60; // Плотность Тени от 60% до 90%

    try {
      const response = await fetch("/api/mirror-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryArchetype, shadowLevel, answers, sessionId })
      });
      const data = await response.json();
      
      if (data.result) {
        setResult({ archetype: primaryArchetype, level: shadowLevel, text: data.result });
        setCurrentStep(4);
      } else {
        alert("Subconscious feedback loop detected. Mirror calibration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Neural linkage shattered. Check your connection protocol.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (answers.length === QUEST_QUESTIONS.length && !isAnalyzing && !result) {
      processMetrics();
    }
  }, [answers]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-void text-mystic">
      <AuraBackground isResult={currentStep === 4} />
      {isAnalyzing && <SmokeLoader />}

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        
        {/* LANDING / INTRO NODE */}
        {currentStep === 0 && (
          <div className="text-center bg-obsidian-glass/60 backdrop-blur-xl border border-slate-800/40 p-8 md:p-12 rounded-3xl shadow-aura-glow animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-serif tracking-[0.2em] text-slate-100 mb-3 uppercase drop-shadow-[0_0_12px_rgba(45,212,191,0.2)]">
              SHADOW MIRROR
            </h1>
            <p className="text-xs text-cyber font-mono tracking-[0.3em] mb-10 uppercase">[ Advanced Persona Diagnosis ]</p>
            <p className="text-sm text-mystic/70 font-light leading-relaxed mb-10 max-w-md mx-auto">
              Expose what lies beneath the conscious mind. This interactive matrix evaluates your psychological defensive layers and maps the structural density of your Jungian Shadow.
            </p>
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full bg-cyber hover:bg-teal-400 text-void py-4 rounded-2xl font-mono tracking-widest text-xs uppercase font-bold transition-all duration-300 shadow-cyber-glow active:scale-[0.99]"
            >
              Initiate Cognitive Submersion →
            </button>
          </div>
        )}

        {/* ACTIVE QUESTION MATRIX */}
        {currentStep > 0 && currentStep <= QUEST_QUESTIONS.length && !isAnalyzing && (
          <div className="w-full bg-obsidian-glass/60 backdrop-blur-xl border border-slate-800/40 p-6 md:p-10 rounded-3xl shadow-aura-glow animate-fade-in">
            <div className="flex justify-between items-center mb-8 font-mono text-[10px] text-cyber tracking-widest uppercase">
              <span>SCANNING MATRIX: KEY_0{currentStep}</span>
              <span>{Math.round((currentStep / QUEST_QUESTIONS.length) * 100)}% ENCRYPTED</span>
            </div>
            
            <h2 className="text-lg md:text-xl font-serif text-slate-100 leading-relaxed mb-8">
              {QUEST_QUESTIONS[currentStep - 1].text}
            </h2>

            <div className="space-y-4">
              {QUEST_QUESTIONS[currentStep - 1].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt.score)}
                  className="w-full text-left bg-void/40 hover:bg-teal-950/20 border border-slate-900 hover:border-cyber/40 p-4 rounded-xl text-xs md:text-sm font-light transition-all duration-300 group leading-relaxed"
                >
                  <span className="font-mono text-cyber mr-2 group-hover:text-white">[{i+1}]</span> {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* METAPSYCHOLOGY DIAGNOSIS REPORT */}
        {currentStep === 4 && result && !isAnalyzing && (
          <div className="w-full bg-obsidian-glass/40 backdrop-blur-xl border border-cyan-900/30 p-6 md:p-10 rounded-3xl shadow-cyber-glow animate-fade-in max-h-[85vh] overflow-y-auto scrollbar-thin">
            <h2 className="text-3xl font-serif text-slate-100 tracking-wider text-center mb-2">The Diagnosis</h2>
            
            <div className="flex justify-center space-x-6 my-6 font-mono bg-void/70 border border-slate-900/80 p-4 rounded-xl max-w-sm mx-auto text-center">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase tracking-wider">CORE IDENTITY</span>
                <span className="text-sm text-cyber font-bold tracking-widest uppercase">{result.archetype}</span>
              </div>
              <div className="border-l border-slate-800"></div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase tracking-wider">SHADOW DENSITY</span>
                <span className="text-sm text-aura font-bold font-mono">{result.level}%</span>
              </div>
            </div>

            {/* ИИ Текст */}
            <div className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-wrap mt-8 border-t border-slate-900 pt-6">
              {result.text}
            </div>

            {/* INTERNATIONAL CRYPTO MERCHANDISE PAYWALL */}
            <div className="mt-10 bg-void/90 border border-purple-900/40 p-6 rounded-2xl text-center shadow-aura-glow">
              <span className="text-xs text-aura font-mono tracking-widest uppercase block mb-1">🔒 METAPSYCHOLOGY PROTOCOL</span>
              <h4 className="text-base font-serif text-slate-200 mb-2">Unlock Your 7-Page Structural Blueprint</h4>
              <p className="text-[11px] text-slate-500 font-light mb-5 max-w-xs mx-auto">
                Reveals clinical behavioral projections, compensation triggers, and full shadow integration guidelines.
              </p>
              <button 
                onClick={() => alert("Crypto API Gateway (CryptoCloud Merchant) will activate immediately upon main domain routing.")}
                className="w-full bg-aura hover:bg-purple-700 text-white py-3.5 rounded-xl text-xs font-mono tracking-widest uppercase transition-all duration-300 shadow-lg active:scale-[0.98]"
              >
                [ Access Blueprint for 3.00 USDT ]
              </button>
            </div>

            {/* CROSS-PROMOTION HUB */}
            <a
              href={`https://aura-ai.vercel.app/?session_id=${sessionId}`}
              className="block text-center w-full mt-5 border border-slate-800/80 hover:border-cyber/40 text-slate-500 hover:text-cyber py-3.5 rounded-2xl font-mono tracking-widest text-xs uppercase transition-all duration-300"
            >
              ← Transfer Archetype to AuraAI Oracle
            </a>
          </div>
        )}

      </div>
    </main>
  );
}