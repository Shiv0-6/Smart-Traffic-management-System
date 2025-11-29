import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PeakHourData {
  hour: number;
  density: number;
}

interface PeakHourHeatmapProps {
  data?: PeakHourData[];
}

const PeakHourHeatmap: React.FC<PeakHourHeatmapProps> = ({ data }) => {
  const defaultData: PeakHourData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    density: Math.floor(Math.random() * 100) + 20,
  }));

  const trafficData = data || defaultData;

  const getColorForDensity = (density: number): string => {
    if (density > 80) return 'rgba(239, 68, 68, 0.8)';
    if (density > 60) return 'rgba(245, 158, 11, 0.8)';
    if (density > 40) return 'rgba(234, 179, 8, 0.8)';
    return 'rgba(34, 197, 94, 0.8)';
  };

  const chartData = {
    labels: trafficData.map((d) => `${d.hour}:00`),
    datasets: [
      {
        label: 'Traffic Density',
        data: trafficData.map((d) => d.density),
        backgroundColor: trafficData.map((d) => getColorForDensity(d.density)),
        borderColor: trafficData.map((d) =>
          getColorForDensity(d.density).replace('0.8', '1')
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: 'hsl(var(--foreground))',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            const density = context.parsed.y;
            let level = 'Low';
            if (density > 80) level = 'Critical';
            else if (density > 60) level = 'High';
            else if (density > 40) level = 'Medium';
            return `Density: ${density}% (${level})`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(var(--border) / 0.2)',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'hsl(var(--border) / 0.2)',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          callback: function (value: any) {
            return value + '%';
          },
        },
        title: {
          display: true,
          text: 'Traffic Density (%)',
          color: 'hsl(var(--foreground))',
        },
      },
    },
  };

  const peakHours = trafficData
    .filter((d) => d.density > 70)
    .sort((a, b) => b.density - a.density)
    .slice(0, 3);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Peak Hour Traffic Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold">Peak Hours</h4>
          <div className="grid grid-cols-3 gap-3">
            {peakHours.map((hour, index) => (
              <div
                key={hour.hour}
                className="p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="text-xs text-muted-foreground">
                  #{index + 1} Peak
                </div>
                <div className="text-lg font-bold">{hour.hour}:00</div>
                <div className="text-sm text-primary">{hour.density}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Low (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>Medium (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>High (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>Critical (&gt;80%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeakHourHeatmap;
