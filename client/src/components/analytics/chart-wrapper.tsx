import { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';

interface ChartWrapperProps {
  type: ChartType;
  data: any;
  options?: any;
  className?: string;
}

export default function ChartWrapper({ type, data, options = {}, className }: ChartWrapperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(),
          }
        }
      },
      scales: type === 'doughnut' || type === 'pie' ? {} : {
        x: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim(),
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim(),
          }
        },
        y: {
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim(),
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim(),
          }
        }
      }
    };

    const config: ChartConfiguration = {
      type,
      data,
      options: {
        ...defaultOptions,
        ...options,
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, data, options]);

  // Update chart theme when dark mode changes
  useEffect(() => {
    const updateChartTheme = () => {
      if (chartRef.current) {
        const chart = chartRef.current;
        const foregroundColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
        const mutedForegroundColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim();

        if (chart.options.plugins?.legend?.labels) {
          chart.options.plugins.legend.labels.color = foregroundColor;
        }
        
        if (chart.options.scales?.x) {
          chart.options.scales.x.grid = { color: borderColor };
          chart.options.scales.x.ticks = { color: mutedForegroundColor };
        }
        
        if (chart.options.scales?.y) {
          chart.options.scales.y.grid = { color: borderColor };
          chart.options.scales.y.ticks = { color: mutedForegroundColor };
        }

        chart.update();
      }
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateChartTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`chart-container ${className || ''}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
