/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Music, 
  Image as ImageIcon,
  Zap,
  FileText,
  Download,
  Trash2,
  AlertCircle,
  ExternalLink,
  Laptop,
  CheckCircle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { generateScripts, type ScriptResult } from './lib/gemini';

// Dynamic helper categories to inject fun pre-sets
const PRESETS = [
  { label: "Trending Motivation Reel", url: "https://www.instagram.com/reel/motivation_mindset_shift" },
  { label: "Crypto Wealth Short", url: "https://www.youtube.com/shorts/finance_wealth_secrets" },
  { label: "AI & Tech Quick Hack", url: "https://www.instagram.com/reel/tech_ai_coder_superpower" },
  { label: "Daily Astrology Vibe", url: "https://www.youtube.com/shorts/astrology_manifest_cosmic" }
];

export default function App() {
  const [urls, setUrls] = useState<string>('');
  const [scripts, setScripts] = useState<ScriptResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedScriptIdx, setCopiedScriptIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!urls.trim()) {
      setError('Please provide at least one URL, title topic, or text content.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Split URLs by newline or comma
      const urlList = urls
        .split(/[\n,]/)
        .map(u => u.trim())
        .filter(u => u.length > 0);
        
      const data = await generateScripts(urlList);
      setScripts(data);
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (presetUrl: string) => {
    if (urls.includes(presetUrl)) return;
    setUrls(prev => prev ? `${prev}\n${presetUrl}` : presetUrl);
  };

  const clearAllUrls = () => {
    setUrls('');
    setError(null);
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIdx(idx);
    setTimeout(() => setCopiedScriptIdx(null), 1500);
  };

  const downloadTxt = () => {
    let content = "REELSCRIPT GENERATED OUTLINE - OFFLINE RESOLVER\n";
    content += "================================================\n";
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    scripts.forEach((s, i) => {
      content += `SCRIPT #${i + 1}: ${s.title}\n`;
      content += `CATEGORY: ${s.category}\n`;
      content += `------------------------------------------------\n\n`;
      content += `[ENGLISH VERSION]\n`;
      content += `Hook: ${s.english.hook}\n`;
      content += `Body: ${s.english.body}\n`;
      content += `CTA:  ${s.english.cta}\n\n`;
      content += `[HINDI VERSION]\n`;
      content += `Hook: ${s.hindi.hook}\n`;
      content += `Body: ${s.hindi.body}\n`;
      content += `CTA:  ${s.hindi.cta}\n\n`;
      content += `AUDIO SUGGESTION: ${s.audioSuggestion}\n`;
      content += `VISUAL IMAGE PROMPT: ${s.imagePrompt}\n\n`;
      content += `================================================\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reelscript_export_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-4 md:p-12 font-sans selection:bg-[#FFE000] selection:text-black">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Top Header Card */}
        <header className="bg-gradient-to-br from-[#121214] to-[#161619] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFE000]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-[#FFE000] rounded-xl text-black inline-flex items-center justify-center glow">
                  <Zap className="w-5 h-5 fill-black" />
                </span>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter font-display">
                  ReelScript<span className="text-[#FFE000]">.</span>
                </h1>
              </div>
              <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
                A professional video-to-script generator working entirely offline. Perfect for creators looking to extract high-yield social hooks, body narratives, and key calls-to-action instantly with zero API overhead.
              </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl text-[10px] font-black text-green-400 tracking-wider uppercase">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              100% Client Protected / Safe
            </div>
          </div>
        </header>

        {/* Part 1: Input Control Panel */}
        <section className="bg-gradient-to-b from-[#121214] to-[#0E0E10] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-[#FFE000] text-xs font-black uppercase tracking-widest">
              <span className="w-6 h-[1px] bg-[#FFE000]/40" /> Step 1: Input Links & Info
            </div>
            {urls.trim() && (
              <button 
                onClick={clearAllUrls}
                className="self-end text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-1 bg-red-500/5 rounded-lg border border-red-500/10"
              >
                Clear Added Links <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-xs text-gray-400 font-medium">
              Paste your source links (Instagram Reels, YouTube Shorts, or Tiktok urls) below, or type your custom story ideas. Add multiple URLs separated by newlines to generate separate scripts for each:
            </label>
            
            <textarea 
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="e.g.&#10;https://www.instagram.com/reel/DQMUaTHiRpB/&#10;https://www.youtube.com/shorts/lqrjCMtHC0Q"
              className="w-full h-40 bg-[#070709] border border-white/10 rounded-2xl p-4 text-sm font-mono leading-relaxed focus:border-[#FFE000] focus:outline-none transition-all scrollbar-hide"
            />

            {/* Quick Demo Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">Quick Demo Feeds:</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => loadPreset(p.url)}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 px-3.5 py-1.5 rounded-full transition-all text-gray-300 flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-[#FFE000]" /> {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 py-4 bg-[#FFE000] text-black font-black uppercase text-xs tracking-widest rounded-full hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Neural Templates...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Scripts Offline</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-400/5 p-4 rounded-xl border border-red-500/20">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </section>

        {/* Part 2: Output Script Viewer */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-[#FFE000] text-xs font-black uppercase tracking-widest">
              <span className="w-6 h-[1px] bg-[#FFE000]/40" /> Step 2: Custom Script Outputs
            </div>
            {scripts.length > 0 && (
              <button 
                onClick={downloadTxt}
                className="flex items-center gap-2 text-[#FFE000] hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10"
              >
                <Download className="w-4 h-4" /> Save Export (.txt)
              </button>
            )}
          </div>

          <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8 min-h-[300px] relative overflow-hidden">
            {!scripts.length && !loading && (
              <div className="h-60 flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                <FileText className="w-16 h-16 text-gray-500 stroke-[1.5]" />
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-[0.3em] block">No Scripts Generated Yet</span>
                  <p className="text-[11px] text-gray-400 font-medium">Add some URLs above and click Generate to see live results instantly!</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-8 animate-pulse py-6">
                {[1, 2].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 w-1/4 bg-white/5 rounded-md" />
                    <div className="h-20 w-full bg-white/5 rounded-md" />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-12">
              {scripts.map((script, idx) => {
                const compiledCopyText = `TITLE: ${script.title}\nCATEGORY: ${script.category}\n\n[ENGLISH]\nHook: ${script.english.hook}\nBody: ${script.english.body}\nCTA: ${script.english.cta}\n\n[HINDI]\nHook: ${script.hindi.hook}\nBody: ${script.hindi.body}\nCTA: ${script.hindi.cta}\n\nAUDIO: ${script.audioSuggestion}\nIMAGE PROMPT: ${script.imagePrompt}`;

                return (
                  <div 
                    key={idx} 
                    className="space-y-6 border-b border-white/5 pb-10 last:border-0 last:pb-0 animate-fade-in"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] p-4 rounded-2xl border border-white/5">
                      <div className="space-y-1 min-w-0">
                        <span className="text-[9px] font-black text-[#FFE000] uppercase tracking-widest block">{script.category}</span>
                        <h3 className="text-lg font-black uppercase italic tracking-tighter truncate text-white">{script.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => copyToClipboard(compiledCopyText, idx)}
                          className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
                        >
                          {copiedScriptIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                              <span>Copy Script</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* English Script Column */}
                      <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#FFE000]">English Logic</span>
                          <span className="text-[9px] text-gray-500 font-mono">STATION 1</span>
                        </div>
                        
                        <div className="space-y-3.5 text-sm">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">The Attention Hook</span>
                            <p className="text-white font-bold leading-relaxed">{script.english.hook}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Main Narrative Body</span>
                            <p className="text-gray-300 leading-relaxed text-xs">{script.english.body}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Call To Action (CTA)</span>
                            <p className="text-[#FFE000] font-black text-xs">{script.english.cta}</p>
                          </div>
                        </div>
                      </div>

                      {/* Hindi Script Column */}
                      <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#FFE000]">Hindi Logic (हिंदी)</span>
                          <span className="text-[9px] text-gray-500 font-mono">STATION 2</span>
                        </div>
                        
                        <div className="space-y-3.5 text-sm text-left">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block text-left">The Attention Hook</span>
                            <p className="text-white font-bold leading-relaxed">{script.hindi.hook}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block text-left">Main Narrative Body</span>
                            <p className="text-gray-300 leading-relaxed text-xs">{script.hindi.body}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block text-left">Call To Action (CTA)</span>
                            <p className="text-[#FFE000] font-black text-xs">{script.hindi.cta}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Recommendations Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A0A0C] border border-white/5 rounded-2xl p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-[#FFE000] shrink-0" />
                        <span className="truncate">Audio suggestion: <span className="text-white">{script.audioSuggestion}</span></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ImageIcon className="w-4 h-4 text-[#FFE000] shrink-0" />
                        <span className="line-clamp-2 leading-relaxed">Visual background: <span className="text-white normal-case italic font-normal">"{script.imagePrompt}"</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Part 3: Install Information Card (Android / APK request solution) */}
        <div className="bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-purple-500/10 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Laptop className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-black uppercase tracking-wider">How to Run & Install as Mobile App (No APK required!)</h2>
          </div>
          <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
            <p>You can run this application entirely offline on your mobile device as an offline web application with zero overhead:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
              <li>Open this app link <span className="text-[#FFE000]">({window.location.origin})</span> in your mobile <span className="font-bold text-blue-400">Chrome</span> or <span className="font-bold text-blue-400">Safari</span> browser.</li>
              <li>Tap the menu icon (three dots on Chrome, or Share button on Safari).</li>
              <li>Select <span className="font-bold text-[#FFE000]">"Add to Home Screen"</span>.</li>
              <li>Once added, it will launch as an app icon with beautiful mobile styling, running completely offline without requiring any server keys or internet!</li>
            </ul>
          </div>
        </div>

      </div>

      <footer className="mt-20 border-t border-white/5 pt-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
        ReelScript Engine • High-Speed Logic Processing
      </footer>
    </div>
  );
}
