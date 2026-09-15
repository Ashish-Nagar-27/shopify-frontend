import { Link, useLocation } from "react-router-dom";

interface TabDef {
  id: string;
  label: string;
  path: string;
}

const TABS: TabDef[] = [
  { id: "billing", label: "Billing & plan", path: "/settings" },
  { id: "integrations", label: "Integrations", path: "/setting/integration" },
  { id: "subaccounts", label: "Sub-accounts", path: "/setting/sub-account" },
];

export function SettingsTabs() {
  const { pathname } = useLocation();

  const getActiveTab = () => {
    if (pathname.includes("integration")) return "integrations";
    if (pathname.includes("sub-account") || pathname.includes("subaccount")) return "subaccounts";
    return "billing";
  };

  const activeTab = getActiveTab();

  return (
    <div className="flex gap-1 border-b border-[var(--border-soft)] px-7">
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
