'use client';

import { memo } from 'react';
import { ServiceDistribution } from '@/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ServiceDistributionChartProps {
  data: ServiceDistribution[];
  className?: string;
}

function ServiceDistributionChartComponent({ data, className = '' }: ServiceDistributionChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Distribución de Servicios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} clientes`, 'Cantidad']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export const ServiceDistributionChart = memo(ServiceDistributionChartComponent); 