// src/components/dashboard/stats-card.tsx
import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-gray-600">
          {trend && (
            <span
              className={trend.isPositive ? "text-green-600" : "text-red-600"}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%{" "}
            </span>
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
