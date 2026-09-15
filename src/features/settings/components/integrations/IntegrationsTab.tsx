import { useIntegrationsQuery } from "../../api/useSettingsQueries";
import { AdAccountsCard } from "./AdAccountsCard";
import { ShopifyCard } from "./ShopifyCard";

/**
 * IntegrationsTab displays:
 * 1. Ad accounts card (Google Ads, Meta Ads) with limit counters and connection picker.
 * 2. Shopify store integration card showing domain and connected status.
 *
 * Data is fetched in a single unified API call: GET /setting/integrations/list.
 */
export function IntegrationsTab() {
  const { data: integrations, isLoading } = useIntegrationsQuery();

  return (
    <div className="flex flex-col gap-5">
      <AdAccountsCard
        adAccounts={integrations?.ad_accounts}
        isLoading={isLoading}
      />
      <ShopifyCard
        shopifyStore={integrations?.shopify_store}
        isLoading={isLoading}
      />
    </div>
  );
}

