"use client";
import { useState } from "react";
import { PrimaryButton } from "@aimone/shared-ui";
import { startSession } from "@aimone/chapter-sdk";

export default function Page() {
  const [sid, setSid] = useState<string | null>(null);
  const [turn, setTurn] = useState<number | null>(null);
  async function onStart() {
    const res = await startSession("chapter3");
    setSid(res.sessionId);
    setTurn(1);
  }
  async function onTurn() {
    if (!sid) return;
    const r = await fetch(`${process.env.NEXT_PUBLIC_PORTAL_URL}/api/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid }),
    });
    const data = await r.json();
    setTurn(data.turn);
  }
  return (
    <main className="p-6">
      <h1>Chapter3</h1>
      {!sid ? (
        <PrimaryButton onClick={onStart}>Start</PrimaryButton>
      ) : (
        <div className="space-y-3">
          <div>Session: {sid}</div>
          <div>Turn: {turn}</div>
          <PrimaryButton onClick={onTurn}>Take Turn</PrimaryButton>
        </div>
      )}
    </main>
  );
}
