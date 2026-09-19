import { Link, useLocation } from "react-router-dom";

interface TabDef {
  id: string;
  label: string;
  path: string;
}

const TABS: TabDef[] = [
  { id: "billing", label: "Billing & plan", path: "/settings" },
  { id: "integrations", label: "Integrations", path: "/settings/integrations" },
  { id: "subaccounts", label: "Sub-accounts", path: "/settings/sub-accounts" },
];

export function SettingsTabs() {
  const { pathname } = useLocation();

  const getActiveTab = () => {
    if (pathname.includes("integrations")) return "integrations";
    if (pathname.includes("sub-accounts")) return "subaccounts";
    return "billing";
  };

  const activeTab = getActiveTab();

  return (
    <div
      className="
    flex
    gap-1
    px-7
    border-b
    border-[oklch(0.24_0.022_235)]
    bg-[linear-gradient(oklch(0.16_0.02_235_/_0.4),oklch(0.16_0.02_235_/_0.82))]
    sticky
    top-18
    z-[4]
    backdrop-blur-[8px]
  "
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`relative mr-6 inline-flex items-center border-b-2 py-4 pb-3.5 text-[13px] font-medium no-underline transition-colors ${
              isActive
                ? "border-[var(--cyan)] text-[var(--fg)]"
                : "border-transparent text-[var(--fg-mute)] hover:text-[var(--fg-dim)]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
