import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { WaitTime, LaneType } from "@/types/crossing";
import type { Trend } from "@/lib/waitTimeTrend";

const LANE_LABELS: Record<LaneType, string> = {
  GENERAL: "General",
  SENTRI: "SENTRI",
  READY_LANE: "Ready Lane",
  PEATONAL: "Peatonal",
};

function toneForWait(minutes: number): "verde" | "amber" | "neutral" {
  if (minutes <= 20) return "verde";
  if (minutes <= 60) return "amber";
  return "neutral";
}

function TrendIcon({ trend }: { trend?: Trend }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-amber-deep" strokeWidth={1.8} />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-verde" strokeWidth={1.8} />;
  return <Minus className="h-4 w-4 text-ink/30" strokeWidth={1.8} />;
}

interface LaneStatusCardProps {
  waitTime: WaitTime;
  trend?: Trend;
}

export function LaneStatusCard({ waitTime, trend }: LaneStatusCardProps) {
  const tone = waitTime.status === "CLOSED" ? "neutral" : toneForWait(waitTime.waitMinutes);
  const statusLabel =
    waitTime.status === "CLOSED" ? "Cerrado" : waitTime.status === "DELAYED" ? "Con demora" : "Abierto";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-ink/10 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink/70">{LANE_LABELS[waitTime.laneType]}</span>
        <Badge tone={tone}>{statusLabel}</Badge>
      </div>
      <div className="flex items-baseline gap-2 font-mono">
        <span className="text-3xl font-bold text-ink">{waitTime.waitMinutes}</span>
        <span className="text-sm text-ink/50">min</span>
        <TrendIcon trend={trend} />
      </div>
      {waitTime.lanesOpen != null && (
        <span className="text-xs text-ink/50">
          {waitTime.lanesOpen} carril{waitTime.lanesOpen === 1 ? "" : "es"} abierto
          {waitTime.lanesOpen === 1 ? "" : "s"}
        </span>
      )}
      {waitTime.constructionNotice && (
        <p className="text-xs text-amber-deep">{waitTime.constructionNotice}</p>
      )}
    </div>
  );
}