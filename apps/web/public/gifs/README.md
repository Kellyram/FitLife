# Exercise GIFs

Add your exercise GIF files in this folder. Use the naming convention:
- `push-up.gif`
- `bench-press.gif` d
- `deadlift.gif`
- `squat.gif`
- `lunges.gif`
- `lat-pulldown.gif`
- `dumbbell-row.gif`
- `shoulder-press.gif`
- `bicep-curl.gif`
- `tricep-dip.gif`
- `calf-raise.gif`
- `plank.gif`
- `leg-raise.gif`
- `running.gif`
- `high-knees.gif`
- `jumping-jacks.gif`
- `burpees.gif`
- `mountain-climbers.gif`
- `russian-twist.gif`

Then update `src/lib/exerciseGifUrls.ts` to reference these files using the `/gifs/filename.gif` path.

**GIF Naming Format:**
- Use lowercase names
- Replace spaces with hyphens
- Keep file names consistent with exercise names in the mapping







  {restTimer && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] text-zinc-500 font-medium">Rest:</span>
                                    {[60, 90].map((sec) => (
                                        <Button
                                            key={sec}
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={() => restTimer.startRest(sec)}
                                        >
                                            <Timer className="h-3 w-3 mr-1" />
                                            {sec}s
                                        </Button>
                                    ))}
                                </div>
                            )}
