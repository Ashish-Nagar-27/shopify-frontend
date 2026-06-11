// import { ReportingChart } from "../components/ReportingChart";
// import { ReportingTable } from "../components/ReportingTable";
// import { useReportingTableData } from "../hooks/useReportingTableData";

// export function ReportingPage() {
//     const { tableData, tableDataLoading, tableDataError,
//         graphData, graphDataLoading, graphDataError } = useReportingTableData();


//     return (
//         <div className="min-h-svh bg-background text-foreground">
//             <main className="mx-auto max-w-6xl px-6 py-4">

//                 <div className="space-y-12 mt-10">
//                     <ReportingChart graphData={graphData} graphDataLoading={graphDataLoading} graphDataError={graphDataError} />
//                     <ReportingTable tableData={tableData} tableDataLoading={tableDataLoading} tableDataError={tableDataError} />
//                 </div>
//             </main>
//         </div>
//     );
// }
import { ReportingChart } from "../components/ReportingChart";
import { ReportingTable } from "../components/ReportingTable";
import { useReportingTableData } from "../hooks/useReportingTableData";
import PumalyzeReport from "../pumalyze/PumalyzeReport";

export function ReportingPage() {
    const { tableData, tableDataLoading, tableDataError,
        graphData, graphDataLoading, graphDataError } = useReportingTableData();


    return (
        <div className="min-h-svh bg-background text-foreground">
            {/* <main className="mx-auto max-w-6xl px-6 py-4"> */}

            {/* <div className="space-y-12 mt-10"> */}
            <PumalyzeReport logoUrl="/images/my-logo.png" />
            {/* </div> */}
            {/* </main> */}
        </div>
    );
}
