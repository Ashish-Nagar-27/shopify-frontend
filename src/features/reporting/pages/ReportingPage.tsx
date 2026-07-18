
import { Insights } from "../insights/Insights";
import { AttributeReport } from "../components/Table/AttributeReportTable";

export function ReportingPage() {
    return (
        <div className="min-h-svh bg-background text-foreground">
             <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px]">
                  <Insights />
                  <section>
                    <AttributeReport />
                  </section>
                </main>
        </div>
    );
}
