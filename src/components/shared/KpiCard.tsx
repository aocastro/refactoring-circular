import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { KpiItem } from "@/types";

interface KpiCardProps extends KpiItem {
  delay?: number;
  onClick?: () => void;
}

const KpiCard = ({ label, value, change, icon: Icon, positive = true, delay = 0, period, onClick }: KpiCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className={`p-4 rounded-xl border border-border bg-card ${
      onClick ? "cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5" : ""
    }`}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      {change && (
        <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? "text-success" : "text-destructive"}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </span>
      )}
    </div>
    <p className="text-xl font-bold font-display text-foreground">{value}</p>
    <div className="flex items-center justify-between mt-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      {period && (
        <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-medium uppercase tracking-wider">
          {period}
        </span>
      )}
    </div>
  </motion.div>
);

export default KpiCard;
