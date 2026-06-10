"use client";
export default function AuraBackground({ isResult }) {
  const auraColor = isResult ? "from-purple-900/30" : "from-teal-900/35";
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050509]">
      {/* Главное центральное свечение */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial ${auraColor} to-transparent blur-[130px] transition-all duration-1000`}></div>
      
      {/* Атмосферные пульсирующие дымки */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-950/10 blur-[110px] animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-teal-950/10 blur-[110px] animate-pulse delay-700"></div>
    </div>
  );
}