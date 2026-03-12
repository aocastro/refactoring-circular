import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { KpiItem } from "@/types";

interface SparklineKpiCardProps extends KpiItem {
  delay?: number;
  sparklineData?: { value: number }[];
  sparklineColor?: string;
}

const SparklineKpiCard = ({
  label,
  value,
  change,
  icon: Icon,
  positive = true,
  delay = 0,
  sparklineData,
  sparklineColor = "hsl(var(--primary))",
}: SparklineKpiCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-4 rounded-xl border border-border bg-card"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      {change && (
        <span
          className={`text-xs font-medium flex items-center gap-0.5 ${
            positive ? "text-success" : "text-destructive"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {change}
        </span>
      )}
    </div>
    <p className="text-xl font-bold font-display text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>

    {sparklineData && sparklineData.length > 1 && (
      <div className="mt-2 -mx-1">
        <ResponsiveContainer width="100%" height={32}>
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={sparklineColor}
              fill={`url(#spark-${label})`}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </motion.div>
);

export default SparklineKpiCard;
