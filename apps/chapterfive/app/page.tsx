"use client";
import { useState } from "react";
import { PrimaryButton } from "@aimone/shared-ui";
import { startSession } from "@aimone/chapter-sdk";

export default function Page() {
  const [sid, setSid] = useState<string | null>(null);
  const onStart = async () => {
    const res = await startSession("chapterfive");
    setSid(res.sessionId);
  };
  return (
    <main className="p-6">
      <h1>Chapter Five</h1>
      {!sid ? <PrimaryButton onClick={onStart}>Start</PrimaryButton> : <div>Session: {sid}</div>}
    </main>
  );
}
