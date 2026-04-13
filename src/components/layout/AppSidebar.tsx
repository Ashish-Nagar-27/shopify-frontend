import { LayoutDashboard, BarChart3, Palette, Settings, UserCircle, CreditCard, Zap, ChevronRight, Eye, BrainCircuit, Users } from "lucide-react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Link } from "react-router-dom"

// Dashboard sub-items
const dashboardSubItems = [
  { title: "Overview", url: "/dashboard/overview", icon: Eye },
  { title: "AI Insight", url: "/dashboard/ai-insight", icon: BrainCircuit },
  { title: "Demographic", url: "/dashboard/demographic", icon: Users },
]

// Other menu items (flat links)
const items = [
  {
    title: "Reporting",
    url: "/reporting",
    icon: BarChart3,
  },
  {
    title: "Creative",
    url: "/creative",
    icon: Palette,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserCircle,
  },
  {
    title: "Billing",
    url: "/pricing",
    icon: CreditCard,
  },
]

export function AppSidebar() {
  const { setOpen } = useSidebar()
  const [dashboardOpen, setDashboardOpen] = useState(false)

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="fixed top-0 left-0 z-50 h-full "
    >
      <Sidebar variant="sidebar" collapsible="icon">

        <SidebarHeader className="my-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Zap className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Trackocity</span>
                    <span className="text-xs text-muted-foreground">Analytics</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Dashboard with collapsible sub-items */}
                <Collapsible asChild open={dashboardOpen} onOpenChange={setDashboardOpen} className="group/collapsible">
                  <SidebarMenuItem
                  // onMouseEnter={() => setDashboardOpen(true)}
                  // onMouseLeave={() => setDashboardOpen(false)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {dashboardSubItems.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={sub.url}>
                                <sub.icon className="size-4" />
                                <span>{sub.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Other flat menu items */}                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
