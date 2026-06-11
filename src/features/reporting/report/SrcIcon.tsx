import type { SourceKey } from '@/lib/types';

const base = 'w-[22px] h-[22px] rounded-[6px] inline-grid place-items-center font-bold text-[11px] text-white flex-shrink-0';

interface Props { src: SourceKey; }

export function SrcIcon({ src }: Props) {
  if (src === 'fb') return <span className={`${base} bg-[linear-gradient(135deg,#1877F2,#0a4fb0)]`} title="Meta Ads">f</span>;
  if (src === 'go') return <span className={`${base} bg-[linear-gradient(135deg,#ea4335,#fbbc04_50%,#34a853)]`} title="Google Ads">G</span>;
  if (src === 'tt') return <span className={`${base} bg-black shadow-[0_0_0_1px_#555_inset]`} title="TikTok Ads">𝕋</span>;
  return null;
}
