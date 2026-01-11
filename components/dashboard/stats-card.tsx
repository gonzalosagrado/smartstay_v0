import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, trendLabel, className }: StatsCardProps) {
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn("text-sm font-medium", isPositive && "text-green-600", isNegative && "text-red-600")}
                >
                  {isPositive && "+"}
                  {trend}%
                </span>
                {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
