// ── New rich format returned by Claude ────────────────────────────────────
export interface Flag {
  id: string;           // e.g. "FORCED_ARBITRATION"
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  quote: string;        // exact snippet from the document
}

export interface AdviceTip {
  flag_id: string;      // references Flag.id
  tip: string;
}

export interface ScanResult {
  domain: string | null;
  score: number | null;
  verdict: "Low Risk" | "Medium Risk" | "High Risk" | "Critical Risk" | null;
  summary: string | null;
  flags: Flag[];
  advice: AdviceTip[];
  safe_clauses: string[];
  error: string | null;

  // Legacy fields kept for DB-stored history records
  riskLevel?: "green" | "yellow" | "red";
  redFlags?: RedFlag[];
}

// ── Legacy type (kept for scan history records from DB) ───────────────────
export interface RedFlag {
  clause: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

export interface Scan {
  id: string;
  userId: string;
  input: string;
  website: string | null;
  riskLevel: "green" | "yellow" | "red";
  score: number;
  redFlags: RedFlag[];
  advice: string[];
  createdAt: string;
}
