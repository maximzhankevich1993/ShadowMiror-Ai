"use client";
export default function SmokeLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-[#050509]/90 backdrop-blur-md flex flex-col items-center justify-center font-mono">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border border-cyber/30 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border border-aura/20 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyber to-aura opacity-15 blur-xl"></div>
      </div>
      <p className="text-xs text-cyber tracking-[0.25em] uppercase animate-pulse">
        Decrypting Subconscious Matrix...
      </p>
    </div>
  );
}