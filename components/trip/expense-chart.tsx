'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseChartProps {
  expenses: any[];
  view: 'daily' | 'category';
  onViewChange: (view: 'daily' | 'category') => void;
}

export function ExpenseChart({ expenses, view, onViewChange }: ExpenseChartProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
        border: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
        border: {
          color: gridColor,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: gridColor,
        borderWidth: 1,
      },
    },
  };

  // Aggregating daily expenses
  const dailyExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString('en-GB', {
      weekday: 'short',
    });
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += expense.amount;
    return acc;
  }, {});

  const dailyLabels = Object.keys(dailyExpenses).reverse();
  const dailyData = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Daily Expenses',
        data: dailyLabels.map((date) => dailyExpenses[date]).reverse(),
        borderColor: isDark ? 'white' : 'hsl(var(--primary))',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };


  // Aggregating expenses by category
  const categoryExpenses = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  const categoryLabels = Object.keys(categoryExpenses);
  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Expenses by Category',
        data: categoryLabels.map((category) => categoryExpenses[category]),
        backgroundColor: [
          'hsl(var(--chart-1))',
          'hsl(var(--chart-2))',
          'hsl(var(--chart-3))',
          'hsl(var(--chart-4))',
          'hsl(var(--chart-5))',
        ],
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
    ],
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Expense Analysis</CardTitle>
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value: any) => onViewChange(value)}
              className="flex-shrink-0"
            >
              <ToggleGroupItem value="daily" className="text-xs sm:text-sm">Daily</ToggleGroupItem>
              <ToggleGroupItem value="category" className="text-xs sm:text-sm">Category</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[400px]">
            {view === 'daily' ? (
              <Line data={dailyData} options={options} />
            ) : (
              <Bar data={categoryData} options={options} />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
