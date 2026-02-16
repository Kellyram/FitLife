export function TodaySchedule() {
    return (
        <div className="rounded-2xl bg-card border border-border p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-foreground">Today's Schedule</h3>
            <div className="flex-1 flex items-center justify-center min-h-[80px]">
                <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        </div>
    )
}
