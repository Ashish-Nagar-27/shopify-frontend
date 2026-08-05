import { useEffect, useState } from "react";
import { COL_BY_KEY, COLUMN_PRESETS, mapPresetViewName } from '@/lib/data';
import type { ColumnDef } from '@/lib/types';
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportingApi } from "../api/reportingApi";


const useCustomizeColumns = () => {


  //  open customize columns modal
  const [customOpen, setCustomOpen] = useState(false);
  //  active preset name
  const [activePreset, setActivePreset] = useState('Default');

  //  visible columns
  const [visibleCols, setVisibleCols] = useState<ColumnDef[]>(COLUMN_PRESETS['Default']);

  const [hasInitializedCols, setHasInitializedCols] = useState(false);


  const { user } = useAuthStore();


  //  columns data from backend
  // const { customizedColumnsData, updateColumnsMutation, deleteColumnsMutation } = useReportingTableData();
  const queryClient = useQueryClient();
  const { data: customizedColumnsData, isLoading: customizedColumnsDataLoading, error: customizedColumnsDataError } = useQuery({
    queryKey: ["reportingCustomizedColumns"],
    queryFn: async () => {
      const data = await reportingApi.getCustomizedColumns();
      console.log("Customized Columns Data:", data);
      return data;
    },
  });

  // update views and columns
  const updateColumnsMutation = useMutation({
    mutationFn: async ({ updatecols, viewName = 'myview' }: { updatecols: any[]; viewName?: string }) => {
      return await reportingApi.updateCustomizedColumns(updatecols, viewName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportingCustomizedColumns"] });
    },
  });

  // delete views
  const deleteColumnsMutation = useMutation({
    mutationFn: async (viewName: string) => {
      return await reportingApi.deleteCustomizedColumns(viewName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportingCustomizedColumns"] });
    },
  });
  
    


    
      // Load default customized columns from backend once available and update theme sequencially
      useEffect(() => {
        if (customizedColumnsData?.data && !hasInitializedCols) {
          let cols = [...customizedColumnsData.data]
            .sort((a, b) => a.seq - b.seq)
            .map(item => COL_BY_KEY[item.field])
            .filter(Boolean) as ColumnDef[];
    
          // Filter out name and status completely
          cols = cols.filter(c => c.key !== 'name' && c.key !== 'status');
    
          if (cols.length > 0) {
            setVisibleCols(cols);
            const match = Object.entries(COLUMN_PRESETS).find(
              ([, k]) => {
                const pk = k.filter(c => c.key !== 'name' && c.key !== 'status');
                return pk.length === cols.length && pk.every((v, i) => v.key === cols[i].key);
              }
            );
            setActivePreset(match ? match[0] : 'Custom');
            setHasInitializedCols(true);
          }
        }
      }, [customizedColumnsData, hasInitializedCols]);



    //    update  active preset
      const onApplyPreset = (name: string) => {
        setActivePreset(name);
        const presetCols = COLUMN_PRESETS[name].filter(c => c.key !== 'name' && c.key !== 'status');
        setVisibleCols(presetCols);
        const updatecols = presetCols?.map((col, index) => ({ field: col.key, seq: index + 1, workspace: user?.id }))
        updateColumnsMutation.mutate({ updatecols, viewName: mapPresetViewName(name) });
      };

    //   create new custom preset
      const onApplyCustom = (cols: ColumnDef[], viewName?: string) => {
        const cleanCols = cols.filter(c => c.key !== 'name' && c.key !== 'status');
    
        setVisibleCols(cleanCols);
        const updatecols = cleanCols?.map((col, index) => ({ field: col.key, seq: index + 1, workspace: user?.id }))
        const match = Object.entries(COLUMN_PRESETS).find(
          ([, k]) => {
            const pk = k.filter(c => c.key !== 'name' && c.key !== 'status');
            return pk.length === cleanCols.length && pk.every((v, i) => v.key === cleanCols[i].key);
          }
        );
        const presetName = match ? match[0] : 'Custom';
        setActivePreset(presetName);
    
        updateColumnsMutation.mutate({ updatecols, viewName: viewName || "myview" });
      };
    
    //   save preset columns to backend    
      const handleSavePreset = (presetName: string, selectedCols: ColumnDef[]) => {
        const cleanCols = selectedCols.filter(c => c.key !== 'name' && c.key !== 'status');
    
        const updatecols = cleanCols.map((col, index) => ({
          field: col.key,
          seq: index + 1,
          workspace: user?.id,
        }));
     

        // 
        updateColumnsMutation.mutate(
          { updatecols, viewName: presetName },
          {
            onSuccess: () => {
              setVisibleCols(cleanCols);
              setActivePreset(presetName);
            },
          }
        );
      };

    //   delete preset view
      const handleDeletePreset = (presetName: string) => {
        deleteColumnsMutation.mutate(presetName, {
          onSuccess: () => {
            if (activePreset === presetName) {
              setActivePreset('Default');
              setVisibleCols(COLUMN_PRESETS['Default']);
            }
          },
        });
      };


    return {
        customOpen, 
        setVisibleCols,
        setCustomOpen, 
        onApplyPreset, 
        onApplyCustom, 
        handleSavePreset, 
        handleDeletePreset,
        customizedColumnsData,
        visibleCols,
        setActivePreset,
        activePreset
    }
}


export default useCustomizeColumns