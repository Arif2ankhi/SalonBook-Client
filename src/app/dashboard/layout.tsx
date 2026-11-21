import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardLayout = ({children} : {children:React.ReactNode}) => {
    return (
    <SidebarProvider>
        <DashboardSidebar></DashboardSidebar>
        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
};

export default DashboardLayout;