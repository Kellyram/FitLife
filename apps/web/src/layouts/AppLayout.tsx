import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { BottomNav } from "@/components/BottomNav"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 pb-20 lg:pb-4 overflow-auto">
                    <Suspense fallback={
                        <div className="h-full w-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </main>
                <BottomNav />
            </div>
        </div>
    )
}
