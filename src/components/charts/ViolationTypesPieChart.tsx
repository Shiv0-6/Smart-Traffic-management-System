import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, AlertTriangle, Navigation2 } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ViolationStats {
  redLight: number;
  wrongWay: number;
}

interface ViolationTypesPieChartProps {
  stats?: ViolationStats;
}

const ViolationTypesPieChart: React.FC<ViolationTypesPieChartProps> = ({
  stats,
}) => {
  const defaultStats: ViolationStats = {
    redLight: 65,
    wrongWay: 35,
  };

  const violationStats = stats || defaultStats;
  const total = violationStats.redLight + violationStats.wrongWay;

  const chartData = {
    labels: ['Red Light Violations', 'Wrong Way Violations'],
    datasets: [
      {
        label: 'Violations',
        data: [violationStats.redLight, violationStats.wrongWay],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: ['rgba(239, 68, 68, 1)', 'rgba(245, 158, 11, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Violation Types Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <Pie data={chartData} options={options} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Red Light</span>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {violationStats.redLight}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {((violationStats.redLight / total) * 100).toFixed(1)}% of total
            </div>
          </div>

          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Navigation2 className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Wrong Way</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {violationStats.wrongWay}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {((violationStats.wrongWay / total) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Violations</span>
            <span className="text-xl font-bold text-primary">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViolationTypesPieChart;
