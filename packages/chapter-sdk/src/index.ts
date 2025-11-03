import type { Decision, GameState } from "@aimone/types";
const base = () => process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000";
export async function startSession(chapter: string) {
  const res = await fetch(`${base()}/api/session/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chapter }), credentials: "include" });
  if (!res.ok) throw new Error("startSession failed");
  return res.json() as Promise<{ sessionId: string; jwt?: string }>;
}
export async function logTurn(payload: { sessionId: string; chapter: string; turn: number; decision: Decision; outcome?: Partial<GameState>; playerText?: string; }) {
  const res = await fetch(`${base()}/api/turn`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), credentials: "include" });
  if (!res.ok) throw new Error("logTurn failed"); return res.json();
}
export async function logMessages(payload: { sessionId: string; chapter: string; turn: number; messages: Array<{ role: "player" | "system" | "simulator" | "competitor" | "grader" | "tool"; content: string; model?: string; promptTokens?: number; completionTokens?: number; latencyMs?: number; }>; }) {
  const res = await fetch(`${base()}/api/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), credentials: "include" });
  if (!res.ok) throw new Error("logMessages failed"); return res.json();
}
