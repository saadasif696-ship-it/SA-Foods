import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Database,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  UploadCloud,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  testSupabaseConnection,
  seedInitialMenuToSupabase,
  SUPABASE_SQL_DDL,
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectedChange?: (connected: boolean) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConnectedChange,
}) => {
  const [tab, setTab] = useState<'config' | 'schema' | 'guide'>('config');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Load existing config on mount / open
  useEffect(() => {
    if (isOpen) {
      const config = getStoredSupabaseConfig();
      setSupabaseUrl(config.url);
      setSupabaseAnonKey(config.anonKey);
      if (config.url && config.anonKey) {
        handleQuickTest(config.url, config.anonKey);
      }
    }
  }, [isOpen]);

  const handleQuickTest = async (url: string, key: string) => {
    setIsTesting(true);
    const res = await testSupabaseConnection(url, key);
    setTestResult(res);
    setIsTesting(false);
    if (onConnectedChange) {
      onConnectedChange(res.success);
    }
  };

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setIsTesting(true);
    const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
    setTestResult(res);
    setIsTesting(false);
    if (onConnectedChange) {
      onConnectedChange(res.success);
    }
  };

  const handleSeedMenu = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setSeedResult({ success: false, message: 'Pehle Supabase URL aur Key connect karein.' });
      return;
    }
    setIsSeeding(true);
    setSeedResult(null);
    const res = await seedInitialMenuToSupabase();
    setSeedResult({ success: res.success, message: res.message });
    setIsSeeding(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_DDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#0e1012] border border-[#D9A35F]/40 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden text-left z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D9A35F]/20 px-6 py-5 bg-[#141618]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#D9A35F]/50 bg-[#D9A35F]/10 flex items-center justify-center text-[#D9A35F]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl text-white tracking-wide font-normal">
                  Supabase Backend Integration
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#D9A35F]/20 text-[#D9A35F] border border-[#D9A35F]/30">
                  AI Studio Live
                </span>
              </div>
              <p className="text-xs text-[#BDBDBD] font-light">
                SA Foods database connection & live synchronization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#BDBDBD] hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-white/10 bg-[#0a0b0d] px-6 text-xs uppercase tracking-wider">
          <button
            onClick={() => setTab('config')}
            className={`py-3.5 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              tab === 'config'
                ? 'border-[#D9A35F] text-[#D9A35F]'
                : 'border-transparent text-[#BDBDBD] hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Connection & Seeding</span>
          </button>
          <button
            onClick={() => setTab('schema')}
            className={`py-3.5 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              tab === 'schema'
                ? 'border-[#D9A35F] text-[#D9A35F]'
                : 'border-transparent text-[#BDBDBD] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SQL Schema (DDL)</span>
          </button>
          <button
            onClick={() => setTab('guide')}
            className={`py-3.5 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              tab === 'guide'
                ? 'border-[#D9A35F] text-[#D9A35F]'
                : 'border-transparent text-[#BDBDBD] hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>AI Studio Setup Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#e0e0e0]">
          {tab === 'config' && (
            <div className="space-y-6">
              {/* Notice */}
              <div className="p-4 bg-[#161a1d] border border-white/10 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#D9A35F] shrink-0 mt-0.5" />
                <p className="text-xs text-[#c7c7c7] leading-relaxed">
                  Ye website <strong className="text-[#D9A35F]">Google AI Studio</strong> mein{' '}
                  <strong className="text-white">React + Vite + TypeScript</strong> architecture par live render ho rahi hai.
                  Aap apna Supabase project URL aur Anon Public Key neeche enter karke directly live database se connect kar sakte hain!
                </p>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 border flex items-center justify-between ${
                  testResult?.success
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : testResult
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-[#18191c] border-white/10 text-[#a0a0a0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {testResult?.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : testResult ? (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-neutral-600 animate-pulse" />
                  )}
                  <div>
                    <span className="text-xs font-semibold block uppercase tracking-wider">
                      {testResult?.success
                        ? '🟢 Supabase Connected & Active'
                        : testResult
                        ? '⚠️ Connection Issue / Action Needed'
                        : '⚪ Status: Waiting for Credentials'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {testResult?.message || 'Apne credentials enter karein aur Test Connection par click karein.'}
                    </span>
                  </div>
                </div>

                {supabaseUrl && (
                  <button
                    onClick={() => handleQuickTest(supabaseUrl, supabaseAnonKey)}
                    disabled={isTesting}
                    className="p-1.5 hover:bg-white/10 text-xs border border-white/20 transition-colors"
                    title="Refresh connection status"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSaveAndTest} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#D9A35F] mb-1.5">
                    1. Supabase Project URL
                  </label>
                  <div className="relative">
                    <Database className="w-4 h-4 absolute left-3.5 top-3.5 text-[#888]" />
                    <input
                      type="url"
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full bg-[#161719] border border-white/15 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/25 focus:border-[#D9A35F] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-[#888] block mt-1">
                    Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#D9A35F] mb-1.5">
                    2. Supabase Anon Public Key (client-side)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-[#888]" />
                    <input
                      type="text"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      className="w-full bg-[#161719] border border-white/15 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/25 focus:border-[#D9A35F] focus:outline-none transition-colors font-mono"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-[#888] block mt-1">
                    Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isTesting}
                    className="px-5 py-2.5 bg-[#D9A35F] text-[#070707] font-semibold text-xs uppercase tracking-wider hover:bg-[#e4b272] transition-colors flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Save & Test Connection</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 border border-white/20 text-[#BDBDBD] hover:text-white hover:border-[#D9A35F] text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Open Supabase Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </form>

              {/* Seed Section */}
              <div className="p-4 border border-[#D9A35F]/30 bg-[#161411] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm text-[#D9A35F]">
                      Automatic 1-Click Database Seeding
                    </h4>
                    <p className="text-xs text-[#a0a0a0]">
                      SA Foods ke tamam authentic dishes (Karahi, Seekh Kabab, Charsi Tikka, etc.) ko Supabase table me auto-upload karein.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSeedMenu}
                    disabled={isSeeding || !supabaseUrl}
                    className="px-4 py-2 bg-white/10 hover:bg-[#D9A35F] hover:text-black border border-[#D9A35F]/40 text-xs uppercase tracking-wider text-[#D9A35F] transition-all flex items-center gap-2 disabled:opacity-40"
                  >
                    <UploadCloud className={`w-4 h-4 ${isSeeding ? 'animate-bounce' : ''}`} />
                    <span>{isSeeding ? 'Seeding...' : 'Seed Menu Items'}</span>
                  </button>
                </div>

                {seedResult && (
                  <div
                    className={`p-2.5 text-xs border ${
                      seedResult.success
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-950/30 border-red-500/40 text-red-300'
                    }`}
                  >
                    {seedResult.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-white">PostgreSQL Database Schema</h4>
                  <p className="text-xs text-[#a0a0a0]">
                    Supabase Dashboard ke <strong className="text-[#D9A35F]">SQL Editor</strong> mein is code ko paste karke <strong>Run</strong> karein.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-[#D9A35F] text-[#070707] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#e4b272] transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-[#08090a] border border-white/10 text-[11px] font-mono text-[#a3e635] overflow-x-auto max-h-[350px] leading-relaxed">
                  {SUPABASE_SQL_DDL}
                </pre>
              </div>
            </div>
          )}

          {tab === 'guide' && (
            <div className="space-y-4 text-xs leading-relaxed text-[#c0c0c0]">
              <div className="p-4 bg-[#14171a] border border-[#D9A35F]/30 space-y-2">
                <h4 className="font-serif text-sm text-[#D9A35F]">
                  Google AI Studio + Supabase Setup Steps
                </h4>
                <p>
                  Aapki website Google AI Studio ke live environment mein chal rahi hai. Isay Supabase se connect karne ke 3 aasan steps hain:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 border border-white/10">
                  <h5 className="font-semibold text-white text-xs mb-1">
                    Step 1: Supabase Project Create Karein
                  </h5>
                  <p className="text-[#a0a0a0]">
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D9A35F] underline"
                    >
                      supabase.com
                    </a>{' '}
                    par free account banayein aur "New Project" create karein (name: <code>sa-foods</code>).
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10">
                  <h5 className="font-semibold text-white text-xs mb-1">
                    Step 2: SQL Schema Run Karein
                  </h5>
                  <p className="text-[#a0a0a0]">
                    Upar <strong>"SQL Schema (DDL)"</strong> tab se SQL code copy karein, Supabase Dashboard ke left menu mein <strong>SQL Editor</strong> open karein aur code paste karke <strong>Run</strong> button dabayein. Is se <code>menu_items</code>, <code>orders</code>, aur <code>reservations</code> tables ban jayengi.
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10">
                  <h5 className="font-semibold text-white text-xs mb-1">
                    Step 3: URL & Anon Key Connect Karein
                  </h5>
                  <p className="text-[#a0a0a0]">
                    Supabase Dashboard ke <strong>Project Settings &gt; API</strong> se <strong>Project URL</strong> aur <strong>anon public key</strong> copy karein aur is modal ke <strong>"Connection & Seeding"</strong> tab mein paste karke "Save & Test" karein. Uske baad <strong>"Seed Menu Items"</strong> par click karein!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 bg-[#141618] flex items-center justify-between text-xs text-[#888]">
          <span>SA Foods Luxury Dining • Muhammad Saad Asif</span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/20 text-white hover:bg-white/10 transition-colors uppercase tracking-wider text-[11px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
