import type { ComponentType } from "react";
import {
  AudiencesIcon,
  DashboardIcon,
  ExploreIcon,
  FunnelsIcon,
  GearIcon,
  ReportingIcon,
  type IconProps,
} from "../icons";

interface NavItem {
  id: string;
  title: string;
  Icon: ComponentType<IconProps>;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", title: "Dashboard", Icon: DashboardIcon, href: "#" },
  { id: "reporting", title: "Reporting", Icon: ReportingIcon, href: "#" },
  { id: "audiences", title: "Audiences", Icon: AudiencesIcon, href: "#" },
  { id: "explore", title: "Explore", Icon: ExploreIcon, href: "#" },
  { id: "funnels", title: "Funnels", Icon: FunnelsIcon, href: "#" },
];

interface AppSidebarProps {
  activeItemId?: string;
  onNavigate?: (id: string) => void;
  logoInitial?: string;
}

/** Slim icon-rail navigation used across every authenticated Pumalyze page. */
export function AppSidebar({ activeItemId = "settings", onNavigate, logoInitial = "P" }: AppSidebarProps) {
  return (
    <aside className="sticky top-0 z-[5] flex h-screen w-[72px] flex-none flex-col items-center gap-1.5 border-r border-[var(--border-soft)] bg-[image:linear-gradient(var(--bg-deep),var(--bg-page))] py-3.5">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-[11px] bg-[image:var(--gradient-avatar)] text-[17px] font-bold text-[var(--text-on-accent)] shadow-[0_0_0_1px_var(--border-soft),0_8px_18px_-10px_rgba(0,0,0,0.6)]">
        {logoInitial}
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ id, title, Icon, href }) => {
          const isActive = id === activeItemId;
          return (
            <a
              key={id}
              href={href}
              title={title}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(id);
                }
              }}
              className={`grid h-11 w-11 place-items-center rounded-[10px] transition-colors ${
                isActive
                  ? "bg-[image:var(--gradient-accent)] text-[var(--text-on-accent)]"
                  : "text-[var(--fg-mute)] hover:text-[var(--fg)]"
              }`}
            >
              <Icon width="18" height="18" />
            </a>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-0.5 pb-1.5">
        <a
          href="#settings"
          title="Settings"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate("settings");
            }
          }}
          className={`grid h-11 w-11 place-items-center rounded-[10px] ${
            activeItemId === "settings"
              ? "bg-[image:var(--gradient-accent)] text-[var(--text-on-accent)] shadow-[0_0_0_1px_var(--cyan-deep),0_8px_20px_-8px_var(--cyan-deep)]"
              : "text-[var(--fg-mute)] hover:text-[var(--fg)]"
          }`}
        >
          <GearIcon width="18" height="18" />
        </a>
      </div>
    </aside>
  );
}
