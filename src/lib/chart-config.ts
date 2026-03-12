/** Shared chart styling constants */
export const chartTooltipStyle: React.CSSProperties = {
  background: "hsl(260, 10%, 8%)",
  border: "1px solid hsl(260, 15%, 16%)",
  borderRadius: "8px",
  color: "hsl(0, 0%, 95%)",
  fontSize: 12,
};

export const chartGridStroke = "hsl(260, 15%, 16%)";
export const chartAxisStroke = "hsl(0, 0%, 55%)";
export const chartAxisFontSize = 12;

export const chartColors = {
  primary: "hsl(270, 80%, 60%)",
  accent: "hsl(180, 100%, 50%)",
  success: "hsl(150, 80%, 45%)",
  destructive: "hsl(0, 84%, 60%)",
  muted: "hsl(0, 0%, 55%)",
} as const;
