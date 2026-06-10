"use client";
import { useState, useEffect } from "react";
import AuraBackground from "../components/AuraBackground";
import SmokeLoader from "../components/SmokeLoader";

const QUEST_QUESTIONS = [
  {
    id: 1,
    text: "You are walking down a long corridor in your mind and encounter a locked heavy iron door. What is behind it?",
    options: [
      { text: "Something terrifying that I have locked away permanently.", score: { archetype: "Shadow", weight: 3 } },
      { text: "A forgotten source of ancient knowledge and power.", score: { archetype: "Sage", weight: 3 } },
      { text: "Absolute emptiness, silence, and cold void.", score: { archetype: "Hermit", weight: 3 } }
    ]
  },
  {
    id: 2,
    text: "In a critical crisis, when someone treats you with open injustice, your immediate, raw internal reaction is:",
    options: [
      { text: "To burn everything down and crush them completely.", score: { archetype: "Rebel", weight: 3 } },
      { text: "To wear a cold mask of indifference while analyzing their weakness.", score: { archetype: "Mask", weight: 3 } },
      { text: "To blame myself for letting this situation happen.", score: { archetype: "Shadow", weight: 2 } }
    ]
  },
  {
    id: 3,
    text: "If your deepest, most hidden vice or suppressed desire took the form of a living entity, what would it look like?",
    options: [
      { text: "A chaotic, mocking Jester laughing at social norms.", score: { archetype: "Trickster", weight: 3 } },
      { text: "A powerful, dark monarch demanding absolute control.", score: { archetype: "Ruler", weight: 3 } },
      { text: "A shapeshifting mist that slips through any chains.", score: { archetype: "Shadow", weight: 4 } }
    ]
  }
];

export default function ShadowMirror() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1-3: Questions, 4: Result
  const [answers, setAnswers] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Автономность: ищем сессию везде, если нет — создаем свою уникальную
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("session_id");
    
    if (!id) id = localStorage.getItem("aura_session_id");
    if (!id) id = "_" + Math.random().toString(36).substr(2, 9);
    
    setSessionId(id);
    localStorage.setItem("aura_session_id", id);
  }, []);

  const handleAnswer = (score) => {
    const updatedAnswers = [...answers, score];
    setAnswers(updatedAnswers);

    if (currentStep < QUEST_QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const calculateResult = async () => {
    setIsAnalyzing(true);

    const counts = {};
    answers.forEach(ans => { counts[ans.archetype] = (counts[ans.archetype] || 0) + ans.weight; });
    const primaryArchetype = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const shadowLevel = Math.floor(Math.random() * 35) + 55; // Алгоритмический расчет плотности Тени (55-90%)

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
        alert("Transmission error. The Shadow Mirror is unstable.");
      }
    } catch (error) {
      console.error(error);
      alert("Connection matrix lost. Check your network.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (answers.length === QUEST_QUESTIONS.length && isAnalyzing === false && !result) {
      calculateResult();
    }
  }, [answers]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-void text-mystic font-sans">
      <AuraBackground activeType="tarot" isResult={currentStep === 4} />
      {isAnalyzing && <SmokeLoader />}

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        
        {/* START SCREEN */}
        {currentStep === 0 && (
          <div className="text-center bg-obsidian-glass/50 backdrop-blur-lg border border-slate-800/50 p-8 md:p-10 rounded-3xl shadow-aura-glow animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-slate-100 mb-4 uppercase drop-shadow-[0_0_15px_rgba(45,212,191,0.2)]">
              SHADOW MIRROR
            </h1>
            <p className="text-xs text-cyber font-mono tracking-wider mb-8 uppercase">[ Subconscious Matrix Scanner ]</p>
            <p className="text-sm text-mystic/70 font-light leading-relaxed mb-10">
              Face your suppressed archetypes. This clinical AI scanner decrypts your cognitive blindspots and measures the structural density of your Jungian Shadow. 
            </p>
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full bg-cyber hover:bg-teal-500 text-void py-4 rounded-2xl font-mono tracking-widest text-xs uppercase font-bold transition-all duration-300 shadow-cyber-glow active:scale-[0.99]"
            >
              Initiate Subconscious Scan →
            </button>
          </div>
        )}

        {/* QUEST QUESTIONS */}
        {currentStep > 0 && currentStep <= QUEST_QUESTIONS.length && !isAnalyzing && (
          <div className="w-full bg-obsidian-glass/50 backdrop-blur-lg border border-slate-800/50 p-6 md:p-8 rounded-3xl shadow-aura-glow animate-fade-in">
            <div className="flex justify-between items-center mb-6 font-mono text-[10px] text-cyber tracking-widest uppercase">
              <span>SCANNING NODE: 0{currentStep}</span>
              <span>{Math.round((currentStep / QUEST_QUESTIONS.length) * 100)}% SECURE</span>
            </div>
            
            <h2 className="text-lg md:text-xl font-serif text-slate-200 leading-relaxed mb-8">
              {QUEST_QUESTIONS[currentStep - 1].text}
            </h2>

            <div className="space-y-4">
              {QUEST_QUESTIONS[currentStep - 1].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full text-left bg-void/50 hover:bg-cyan-950/20 border border-slate-800 hover:border-cyber/40 p-4 rounded-xl text-xs md:text-sm font-light transition-all duration-300 group leading-relaxed"
                >
                  <span className="font-mono text-cyber mr-2 group-hover:text-white">[{i+1}]</span> {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS SCREEN + INDEPENDENT CRYPTO PAYWALL */}
        {currentStep === 4 && result && !isAnalyzing && (
          <div className="w-full bg-obsidian-glass/30 backdrop-blur-xl border border-cyan-900/30 p-6 md:p-8 rounded-3xl shadow-cyber-glow animate-fade-in max-h-[85vh] overflow-y-auto scrollbar-thin">
            <h2 className="text-3xl font-serif text-slate-100 tracking-wider text-center mb-2">Your Shadow Analysis</h2>
            
            <div className="flex justify-center space-x-6 my-6 font-mono bg-void/60 border border-slate-900 p-4 rounded-xl max-w-sm mx-auto text-center">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">CORE ARCHETYPE</span>
                <span className="text-xs text-cyber font-bold tracking-widest uppercase">{result.archetype}</span>
              </div>
              <div className="border-l border-slate-800"></div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">SHADOW DENSITY</span>
                <span className="text-xs text-purple-400 font-bold font-mono">{result.level}%</span>
              </div>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-wrap mt-6 border-t border-slate-900 pt-6">
              {result.text}
            </div>

            {/* 💳 INDEPENDENT PAYWALL FOR PREMIUM REVEAL */}
            <div className="mt-8 bg-void/80 border border-purple-900/40 p-6 rounded-2xl text-center shadow-aura-glow">
              <span className="text-xs text-aura font-mono tracking-widest uppercase block mb-1">🔒 LOCKED DEEP INSIGHTS</span>
              <h4 className="text-base font-serif text-slate-200 mb-2">Unlock Your 7-Page Full Metapsychology Report</h4>
              <p className="text-[11px] text-slate-500 font-light mb-4">
                Access deep subconscious integration strategies, customized dream triggers, and shadow compatibility graphs.
              </p>
              <button 
                onClick={() => alert("Crypto Payment (CryptoCloud USDT) will activate post-deployment!")}
                className="w-full bg-aura hover:bg-purple-700 text-white py-3 rounded-xl text-xs font-mono tracking-widest uppercase transition-all duration-300 shadow-lg"
              >
                [ Unlock for 3.00 USDT ]
              </button>
            </div>

            {/* 🔄 ECOSYSTEM CROSS-PROMOTION BUTTON */}
            <a
              href={`https://aura-ai.vercel.app/?session_id=${sessionId}`}
              className="block text-center w-full mt-4 border border-slate-800 hover:border-cyber/40 text-slate-500 hover:text-cyber py-3 rounded-2xl font-mono tracking-widest text-xs uppercase transition-all duration-300"
            >
              ← Sync with AuraAI Oracle
            </a>
          </div>
        )}

      </div>
    </main>
  );
}