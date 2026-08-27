import { Link, useLocation } from 'react-router-dom';
import * as Icon from '@/components/icons';

export function AppSidebar() {
  const location = useLocation();
  const items = [
    { key: "dash",   icon: <Icon.grid     width="18" height="18" />, label: "Dashboard", href: "/dashboard"     },
    { key: "report", icon: <Icon.chart    width="18" height="18" />, label: "Reporting", href: "/reporting" },
    { key: "creative",    icon: <Icon.ad width="18" height="18" />, label: "Creative", href: "/creative" },
    // { key: "expl",   icon: <Icon.search   width="18" height="18" />, label: "Explore"   , href: "/explore"           },
    // { key: "onboarding",    icon: <Icon.funnel   width="18" height="18" />, label: "Onboarding"   , href: "/onboarding"           },
  ];

  return (
    <aside className="w-[72px] sticky top-0 h-screen bg-[linear-gradient(180deg,var(--bg-deep),oklch(0.10_0.018_240))] border-r border-border-soft flex flex-col items-center py-[14px] gap-[6px] z-[5]">
      <Link
        to="/"
        className="w-11 h-11 rounded-[11px] bg-[linear-gradient(135deg,var(--bg-deep),oklch(0.20_0.04_220))] grid place-items-center overflow-hidden mb-3 no-underline shadow-[0_0_0_1px_var(--border-soft),0_8px_18px_-10px_oklch(0_0_0/0.6)]"
        title="Pumalyze">
        <img src='/pumalyze-logo.png' alt="Pumalyze Logo" className="w-13 h-10 w-full h-full object-cover" />
      </Link>

      <nav className="flex flex-col gap-0.5 flex-1 items-center pt-[6px]">
        {items.map((it) => {
          const isActive = location.pathname.startsWith(it.href);
          return (
            <Link
              key={it.key}
              to={it.href}
              className={[
                'relative w-11 h-11 rounded-[10px] grid place-items-center no-underline transition-[color,background] duration-150',
                isActive
                  ? 'text-[oklch(0.10_0.018_240)] bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] shadow-[0_0_0_1px_var(--cyan-deep),0_8px_20px_-8px_oklch(0.68_0.16_210/0.5)]'
                  : 'text-fg-mute hover:text-fg hover:bg-surface',
              ].join(' ')}
              title={it.label}>
              {isActive && (
                <span className="absolute left-[-14px] top-[10px] bottom-[10px] w-[3px] rounded-[0_3px_3px_0] bg-cyan shadow-[0_0_12px_var(--cyan)]" />
              )}
              {it.icon}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-0.5 items-center pb-[6px]">
        <Link
          to="/settings"
          className={[
            'relative w-11 h-11 rounded-[10px] grid place-items-center no-underline transition-[color,background] duration-150',
            location.pathname.startsWith('/settings')
              ? 'text-[oklch(0.10_0.018_240)] bg-[linear-gradient(135deg,var(--cyan),var(--cyan-deep))] shadow-[0_0_0_1px_var(--cyan-deep),0_8px_20px_-8px_oklch(0.68_0.16_210/0.5)]'
              : 'text-fg-mute hover:text-fg hover:bg-surface',
          ].join(' ')}
          title="Settings">
          {location.pathname.startsWith('/settings') && (
            <span className="absolute left-[-14px] top-[10px] bottom-[10px] w-[3px] rounded-[0_3px_3px_0] bg-cyan shadow-[0_0_12px_var(--cyan)]" />
          )}
          <Icon.settings width="18" height="18" />
        </Link>
      </div>
    </aside>
  );
}