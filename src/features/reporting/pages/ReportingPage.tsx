
import TopBar from "@/components/shared/Header";
import { Insights } from "../components/insights/Insights";
import { AttributeReport } from "../components/Table/AttributeReportTable";

export function ReportingPage() {

  return (
    <>
      <TopBar
        showDatePicker={true}
      />
      <div className="min-h-svh bg-background text-foreground">
        <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px]">
          {/* Top Charts section */}
          <Insights />

          <section>
            {/* table for reports */}
            <AttributeReport />
          </section>
        </main>
      </div>
    </>
  );
}
