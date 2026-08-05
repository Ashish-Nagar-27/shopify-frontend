
import { MiniSpark } from './MiniSpark';
import * as Icon from '@/components/icons';
import { fmt } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import useGraphSalesMetrics from '../../hooks/useGraphSalesMetrics';

const formatVal = (val: number | string | null | undefined, label: string): string => {
  if (val == null) return '—';
  if (typeof val === 'string') return val;
  const normalizedLabel = label?.toLowerCase() || '';
  if (normalizedLabel.includes('revenue') || normalizedLabel.includes('sales')) {
    return fmt(val, 0);
  }
  if (normalizedLabel.includes('aov') || normalizedLabel.includes('roi') || normalizedLabel.includes('roas')) {
    return fmt(val, 2);
  }
  return Number.isInteger(val) ? fmt(val, 0) : fmt(val, 2);
};

export function KpiStripSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-[14px] max-[1400px]:gap-[10px] max-[1100px]:grid-cols-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-2 px-[18px] py-4 bg-surface border border-border-soft rounded-[12px] [box-shadow:var(--shadow-card)] overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>

          <Skeleton className="h-[32px] w-28 my-1" />

          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function KpiStrip({ KPISData }: { KPISData: any[] }) {
  return (
    <div className="grid grid-cols-5 gap-[14px] max-[1400px]:gap-[10px] max-[1100px]:grid-cols-3">
      {KPISData?.map((t, i) => {
        const pos = t?.pos !== undefined ? t?.pos : (t?.compare !== undefined ? t.compare >= 0 : true);
        const formattedValue = formatVal(t?.value, t?.label || '');
        const isSuffix = t?.unit === '%' || t?.unit === 'x' || t?.unit === '×';

        let formattedCompare = '';
        if (t?.compare !== undefined && t?.compare !== null) {
          if (typeof t.compare === 'number') {
            formattedCompare = `${Math.abs(t.compare).toFixed(1)}%`;
          } else {
            formattedCompare = t.compare.replace(/^[+-−]/, '');
            if (!formattedCompare.includes('%')) {
              formattedCompare += '%';
            }
          }
        } else if (t?.delta) {
          formattedCompare = t.delta.replace(/^[+-−]/, '');
        }

        let formattedPrevious = '';
        if (t?.previous !== undefined && t?.previous !== null) {
          if (typeof t.previous === 'number') {
            const prevValStr = formatVal(t.previous, t?.label || '');
            const unitStr = t.unit || '';
            if (isSuffix) {
              formattedPrevious = `from ${prevValStr}${unitStr}`;
            } else {
              formattedPrevious = `from ${unitStr}${prevValStr}`;
            }
          } else {
            formattedPrevious = t.previous;
          }
        } else if (t?.hint) {
          formattedPrevious = t.hint;
        }

        return (
          <div
            key={i}
            className="relative flex flex-col gap-2 px-[18px] py-4 bg-surface border border-border-soft rounded-[12px] [box-shadow:var(--shadow-card)] overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-fg-mute">
                {t?.label}
              </span>
              <MiniSpark seed={t?.seed} spark={t?.spark} positive={pos} />
            </div>

            <div className="text-[26px] max-[1400px]:text-[22px] tracking-[-0.02em] font-semibold tabular-nums text-fg">
              {!isSuffix && t?.unit && (
                <span className="text-[14px] text-fg-mute mr-[3px] font-medium">{t?.unit}</span>
              )}
              {formattedValue}
              {isSuffix && t?.unit && (
                <span className="text-[14px] text-fg-mute ml-[3px] font-medium">{t?.unit}</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 text-[11px] text-fg-mute font-mono">
              {formattedCompare ? (
                <span className={[
                  'inline-flex items-center gap-1 px-[7px] py-[3px] rounded-[6px]',
                  pos ? 'text-pos bg-pos-soft' : 'text-neg bg-neg-soft',
                ]?.join(' ')}>
                  {pos
                    ? <Icon.arrowUp width="9" height="9" />
                    : <Icon.arrowDown width="9" height="9" />}
                  {formattedCompare}
                </span>
              ) : (
                <span />
              )}
              {formattedPrevious && (
                <span className="text-fg-faint">{formattedPrevious}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function KpiStrips() {
  const { graphData, graphDataLoading } = useGraphSalesMetrics();

  const KPISData = [
    {
      label: "Total Revenue",
      unit: "₹",
      ...graphData?.total_revenue,
    },
    {
      label: "Total Sales",
      unit: "",
      ...graphData?.total_sales,
    },
    {
      label: "AOV",
      unit: "₹",
      ...graphData?.aov,
    },
    {
      label: "ROI",
      unit: "%",
      ...graphData?.roi,
    },
    {
      label: "Blended ROAS",
      unit: "x",
      ...graphData?.blended_roas,
    },
  ];

  if (graphDataLoading) {
    return <KpiStripSkeleton />;
  }

  return <KpiStrip KPISData={KPISData} />;
}