"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "ac-admin-auth";
const PASSWORD = "ablecareadmin";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) === "1") setAuthed(true);
  }, []);

  if (!mounted) return null;
  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-ac-grey py-24">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-3">
          Admin Only
        </div>
        <div className="text-2xl font-bold text-ac-black mb-2">Component Library</div>
        <p className="text-sm text-ac-black/60 font-light mb-6">
          Enter the admin password to view this page.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Admin password"
            autoFocus
            className={`w-full px-4 py-3 rounded-lg border-2 text-sm outline-none transition-colors ${
              error ? "border-red-400" : "border-black/10 focus:border-ac-blue"
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-2">Incorrect password</p>}
          <button
            type="submit"
            className="w-full mt-4 bg-ac-blue text-white font-bold py-3 rounded-full hover:bg-ac-blue/90 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
