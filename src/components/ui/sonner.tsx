import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useThemeStore } from "@/store/useThemeStore"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const mode = useThemeStore((state) => state.mode)

  return (
    <Sonner
      theme={mode as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      position="top-right"
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "relative overflow-hidden pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:bg-[var(--primary)]",
          closeButton:
            "!absolute !left-auto !right-0 !top-5 " +
            "!translate-x-0 !translate-y-0 " +
            "!flex !h-6 !w-6 " +
            "!items-center !justify-center " +
            "!rounded-md !border !border-border " +
            "!bg-background !text-muted-foreground " +
            "!opacity-100 " +
            "hover:!bg-muted hover:!text-foreground",
        },
      }}
      
      {...props}
    />
  )
}

export { Toaster }
