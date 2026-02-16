import type { Post } from "@fitlife/shared"
import { Avatar, AvatarFallback, AvatarImage } from "@fitlife/ui"
import { Button } from "@fitlife/ui"
import { Heart, MessageCircle, Share2, Bookmark, Award } from "lucide-react"
import { useState, memo } from "react"
import { motion } from "framer-motion"

interface PostCardProps {
    post: Post
    isTransformation?: boolean
}

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
}

function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return n.toString()
}

export const PostCard = memo(function PostCard({ post, isTransformation }: PostCardProps) {
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)

    return (
        <div className="rounded-2xl bg-card border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 pb-3">
                <div className="ring-2 ring-blue-500/30 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs font-bold">
                            {post.author.name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{post.author.name}</p>
                    <span className="text-[11px] text-zinc-500">{timeAgo(post.createdAt)}</span>
                </div>
                {isTransformation && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 text-[10px] font-semibold">
                        <Award className="h-3 w-3" />
                        Transformation
                    </div>
                )}
            </div>

            {/* Image */}
            <div className="aspect-[4/5] w-full bg-zinc-800 relative overflow-hidden">
                <img
                    src={`https://picsum.photos/seed/${post.id}/400/500`}
                    alt="Post content"
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
                {isTransformation && (
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
                            Before
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-blue-500/80 backdrop-blur-sm text-white text-xs font-semibold">
                            After
                        </div>
                    </div>
                )}
            </div>

            {/* Engagement Bar */}
            <div className="p-4 pt-3">
                <div className="flex items-center justify-between mb-2.5">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setLiked(!liked)}
                            className="flex items-center gap-1.5 text-sm transition-colors"
                        >
                            <motion.div
                                whileTap={{ scale: 1.3 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Heart
                                    className={`h-5 w-5 transition-colors ${liked ? "fill-blue-500 text-blue-500" : "text-zinc-400 hover:text-zinc-300"
                                        }`}
                                />
                            </motion.div>
                            <span className={`text-xs font-medium ${liked ? "text-blue-400" : "text-zinc-500"}`}>
                                {formatCount(post.likes + (liked ? 1 : 0))}
                            </span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm group">
                            <MessageCircle className="h-5 w-5 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
                            <span className="text-xs font-medium text-zinc-500">{post.comments}</span>
                        </button>
                        <button className="group">
                            <Share2 className="h-5 w-5 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
                        </button>
                    </div>
                    <button onClick={() => setBookmarked(!bookmarked)}>
                        <Bookmark
                            className={`h-5 w-5 transition-colors ${bookmarked ? "fill-blue-500 text-blue-500" : "text-zinc-400 hover:text-zinc-300"
                                }`}
                        />
                    </button>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">{post.content}</p>
            </div>
        </div>
    )
})
