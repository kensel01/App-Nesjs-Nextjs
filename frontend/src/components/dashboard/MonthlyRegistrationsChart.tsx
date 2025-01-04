'use client';

import { MonthlyRegistration } from '@/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyRegistrationsChartProps {
  data: MonthlyRegistration[];
  className?: string;
}

export function MonthlyRegistrationsChart({
  data,
  className = '',
}: MonthlyRegistrationsChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Registros Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value} clientes`, 'Registros']}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 