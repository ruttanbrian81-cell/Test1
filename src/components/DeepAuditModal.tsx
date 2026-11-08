import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DeepAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  platform: string;
}

interface AuditData {
  hookScore: number;
  dwellTimeScore: number;
  shareabilityScore: number;
  viralPotential: string;
  strengths: string[];
  improvementSuggestions: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  finalRecommendation: string;
}

export const DeepAuditModal: React.FC<DeepAuditModalProps> = ({
  isOpen,
  onClose,
  content,
  platform,
}) => {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && content) {
      runAudit();
    }
  }, [isOpen, content]);

  const runAudit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platform,
          industry: 'Technology & AI',
        }),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.error || 'Failed to complete deep analysis.');
      }

      setAuditData(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Gemini 4 Argon Deep Behavioral Audit
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300">
                  gemini-4-argon
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auditing {platform} post for cognitive hook resonance, dwell time, and viral triggers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Snippet */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic">
          "{content}"
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Running High-Reasoning Neural Simulation...
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Simulating audience drop-off curves, cognitive bias activations, and platform feed ranking coefficients.
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs border border-red-200 dark:border-red-800 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={runAudit} className="font-bold underline text-xs cursor-pointer">
              Retry Audit
            </button>
          </div>
        )}

        {/* Audit Results */}
        {!isLoading && auditData && (
          <div className="space-y-6">
            {/* Score Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-violet-50/60 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60">
                <span className="text-[10px] text-violet-600 dark:text-violet-400 uppercase font-bold block mb-1">
                  Hook Magnetism
                </span>
                <span className="text-xl font-extrabold text-violet-900 dark:text-violet-200">
                  {auditData.hookScore}/100
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold block mb-1">
                  Dwell Time
                </span>
                <span className="text-xl font-extrabold text-indigo-900 dark:text-indigo-200">
                  {auditData.dwellTimeScore}/100
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block mb-1">
                  Shareability
                </span>
                <span className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
                  {auditData.shareabilityScore}/100
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/60">
                <span className="text-[10px] text-pink-600 dark:text-pink-400 uppercase font-bold block mb-1">
                  Viral Potential
                </span>
                <span className="text-xs font-extrabold text-pink-900 dark:text-pink-200">
                  {auditData.viralPotential}
                </span>
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Algorithmic Strengths Identified
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {auditData.strengths?.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentence-Level Improvements */}
            {auditData.improvementSuggestions && auditData.improvementSuggestions.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  High-Converting Sentence Replacements
                </h3>
                <div className="space-y-3">
                  {auditData.improvementSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5"
                    >
                      <div className="text-red-500 line-through opacity-75">
                        <span className="font-bold text-[10px] uppercase block text-slate-400 no-underline">
                          Original Phrasing:
                        </span>
                        "{item.original}"
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span className="font-bold text-[10px] uppercase block text-slate-400">
                          Recommended High-Converting Rewrite:
                        </span>
                        "{item.improved}"
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        Behavioral Rationale: {item.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Recommendation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 border border-violet-200/60 dark:border-violet-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 block mb-1">
                Executive Directive:
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {auditData.finalRecommendation}
              </p>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
