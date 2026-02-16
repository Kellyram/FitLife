import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 pb-20 lg:pb-4 overflow-auto">
                    <Outlet />
                </main>
                <BottomNav />
            </div>
        </div>
    )
}
