export type GameState = { turn: number; cash: number; marketShare: number; brandLoyalty: number; history: any[]; };
export type Decision = Record<string, unknown>;
export enum MessageRole { player="player", system="system", simulator="simulator", competitor="competitor", grader="grader", tool="tool" }
