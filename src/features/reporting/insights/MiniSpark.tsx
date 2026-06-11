interface Props {
  seed?: number;
  positive?: boolean;
  w?: number;
  h?: number;
}

export function MiniSpark({ seed = 1, positive = true, w = 70, h = 22 }: Props) {
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
  const ys = pts.map(p => p[1]);
  const yMin = Math.min(...ys) - 0.05;
  const yMax = Math.max(...ys) + 0.05;
  const px = (x: number) => ((x - 0) / (N - 1)) * (w - 4) + 2;
  const py = (y: number) => h - (((y - yMin) / (yMax - yMin)) * (h - 4) + 2);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p[0])},${py(p[1])}`).join(' ');
  const stroke = positive ? 'var(--pos)' : 'var(--neg)';
  const fillId = `spk-${seed}-${positive ? 'p' : 'n'}`;

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={positive ? 'oklch(0.80 0.16 155)' : 'oklch(0.70 0.20 25)'} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={positive ? 'oklch(0.80 0.16 155)' : 'oklch(0.70 0.20 25)'} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${d} L ${px(N - 1)},${h} L ${px(0)},${h} Z`} fill={`url(#${fillId})`}/>
      <path d={d} stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
