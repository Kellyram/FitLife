import { PostCard } from "@/components/community/PostCard"
import type { Post } from "@fitlife/shared"
import { motion } from "framer-motion"
import { PenSquare } from "lucide-react"
import { Button } from "@fitlife/ui"
import { useState } from "react"

const STORIES = [
    { id: "s1", name: "You", avatar: "https://i.pravatar.cc/150?u=you", isOwn: true },
    { id: "s2", name: "Sarah", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: "s3", name: "Mike", avatar: "https://i.pravatar.cc/150?u=mike" },
    { id: "s4", name: "Priya", avatar: "https://i.pravatar.cc/150?u=priya" },
    { id: "s5", name: "James", avatar: "https://i.pravatar.cc/150?u=james" },
    { id: "s6", name: "Aisha", avatar: "https://i.pravatar.cc/150?u=aisha" },
]

const MOCK_POSTS: Post[] = [
    {
        id: "1",
        content: "12 weeks of consistent training + proper nutrition = 15kg down! 🔥 Trust the process.",
        author: { id: "u1", name: "Sarah Jenkins", avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
        likes: 247,
        comments: 32,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: "2",
        content: "Meal prep Sunday is complete! 5 days of high-protein meals ready. Who else preps? 🥗",
        author: { id: "u2", name: "Mike Ross", avatarUrl: "https://i.pravatar.cc/150?u=mike" },
        likes: 89,
        comments: 15,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: "3",
        content: "New PR! Deadlift 180kg 💪 Started at 80kg last year. Consistency beats everything.",
        author: { id: "u3", name: "Priya Sharma", avatarUrl: "https://i.pravatar.cc/150?u=priya" },
        likes: 412,
        comments: 67,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
        id: "4",
        content: "Before vs After — 6 months apart. Never thought I'd see abs at 35! 🙌 #transformation",
        author: { id: "u4", name: "James Carter", avatarUrl: "https://i.pravatar.cc/150?u=james" },
        likes: 1203,
        comments: 156,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        id: "5",
        content: "Morning run in the rain hits different 🌧️ 5K in 24 minutes. Consistency is key!",
        author: { id: "u5", name: "Aisha Williams", avatarUrl: "https://i.pravatar.cc/150?u=aisha" },
        likes: 156,
        comments: 21,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
]

const TABS = ["Feed", "Transformations", "Tips"]

export default function Community() {
    const [activeTab, setActiveTab] = useState("Feed")

    return (
        <div>
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10 px-4 py-3">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <h1 className="text-lg font-bold text-white">Community</h1>
                    <Button variant="ghost" size="icon" className="text-blue-400 hover:bg-blue-500/10 h-9 w-9 rounded-xl">
                        <PenSquare className="h-4.5 w-4.5" />
                    </Button>
                </div>
            </header>

            <div className="max-w-md mx-auto">
                {/* Stories */}
                <div className="flex gap-3 overflow-x-auto py-4 px-4 scrollbar-hide">
                    {STORIES.map((story) => (
                        <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0">
                            <div className={`rounded-full p-[2px] ${story.isOwn ? "bg-zinc-700" : "bg-gradient-to-br from-blue-500 to-cyan-400"}`}>
                                <div className="rounded-full p-0.5 bg-background">
                                    <img
                                        src={story.avatar}
                                        alt={story.name}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-medium">{story.name}</span>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-4 mb-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${activeTab === tab
                                ? "bg-blue-500/15 text-blue-400"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Posts */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 px-4 pb-4"
                >
                    {MOCK_POSTS.map((post, i) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <PostCard post={post} isTransformation={post.id === "4"} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
