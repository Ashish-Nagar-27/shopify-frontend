import { Area, AreaChart, YAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import React from 'react';
import { Tooltip } from 'radix-ui';

interface Props {
  seed?: number;
  spark?: { date: string; value: number }[];
  positive?: boolean;
  w?: number;
  h?: number;
}

export function MiniSpark({ seed = 1, spark, positive = true, w = 70, h = 22 }: Props) {
  const id = React.useId();
  const fillId = `spk-${id.replace(/:/g, '')}-${positive ? 'p' : 'n'}`;

  const rand = (n: number) => {
    const x = Math.sin(seed * 999 + n) * 10000;
    return x - Math.floor(x);
  };
  const N = 14;
  const trend = positive ? 1 : -1;
  const pts = Array.from({ length: N }, (_, i): [number, number] => [
    i,
    0.35 + rand(i) * 0.4 + (i / N) * 0.25 * trend,
  ]);

  const ys = spark ? spark.map(p => p.value) : pts.map(p => p[1]);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const yRange = yMax - yMin;

  const data = spark
    ? spark.map((p, i) => ({ x: i, y: p.value }))
    : pts.map(([x, y]) => ({ x, y }));

  const domainMin = spark
    ? (yRange === 0 ? yMin - 1 : yMin - yRange * 0.05)
    : yMin - 0.05;
  const domainMax = spark
    ? (yRange === 0 ? yMax + 1 : yMax + yRange * 0.05)
    : yMax + 0.05;

  const strokeColor = positive ? 'var(--pos)' : 'var(--neg)';
  const stopColor = positive ? 'oklch(0.80 0.16 155)' : 'oklch(0.70 0.20 25)';

  const chartConfig = {
    trend: {
      label: 'Trend',
      color: strokeColor,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto bg-transparent"
      style={{ width: w, height: h }}
    >
      <AreaChart
        data={data}
        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stopColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={stopColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[domainMin, domainMax]} hide />
        <Area
          type="linear"
          dataKey="y"
          stroke="var(--color-trend)"
          strokeWidth={1.5}
          fill={`url(#${fillId})`}
          dot={false}
          strokeLinecap="round"
        />
       
      </AreaChart>
    </ChartContainer>
  );
}

