import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { integrationApi } from "@/features/integration/api/integrationApi";
import { useAuthStore } from "@/store/useAuthStore";

interface UseEnableTrackingProps {
    onEnableTracking: () => Promise<void>;
    onExtensionVerified?: () => void | Promise<void>;
}

export function useEnableTracking({
    onEnableTracking,
    onExtensionVerified,
}: UseEnableTrackingProps) {
    const queryClient = useQueryClient();
    const [hasOpenedEditor, setHasOpenedEditor] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [checkError, setCheckError] = useState<string | null>(null);
    const [checkSuccess, setCheckSuccess] = useState(false);
    const { user } = useAuthStore();

    const { data: embedStatus, isSuccess } = useQuery({
        queryKey: ["embedStatus"],
        queryFn: integrationApi.getEmbedStatus,
        enabled: !!user,
    });

    useEffect(() => {
          if(isSuccess && embedStatus){
            setCheckSuccess(embedStatus?.active);
            
          }
    },[isSuccess,embedStatus])

    const handleOpenEditor = async () => {
        await onEnableTracking();
        setHasOpenedEditor(true);
        setCheckError(null);
        setCheckSuccess(false);
    };

    const handleCheck = async () => {
        setIsChecking(true);
        setCheckError(null);
        setCheckSuccess(false);

        try {
            const res = await integrationApi.getEmbedStatus();

            if (res.active) {
                setCheckSuccess(true);
                // Invalidate query to update the cache
                queryClient.invalidateQueries({ queryKey: ["embedStatus"] });
                if (onExtensionVerified) {
                    await onExtensionVerified();
                    
                }
            } else {
                setCheckError(
                    "Extension not detected. Make sure you toggled it on and clicked Save in the theme editor."
                );
            }
        } catch {
            setCheckError("Something went wrong. Please try again.");
        } finally {
            setIsChecking(false);
        }
    };

    return {
        hasOpenedEditor,
        isChecking,
        checkError,
        checkSuccess,
        embedStatus,
        handleOpenEditor,
        handleCheck,
    };
}
