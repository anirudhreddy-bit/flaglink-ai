export interface RedFlag {
  clause: string;
  explanation: string;
  severity: "low" | "medium" | "high";
}

export interface ScanResult {
  company?: string;
  riskLevel: "green" | "yellow" | "red";
  score: number;
  redFlags: RedFlag[];
  advice: string[];
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
