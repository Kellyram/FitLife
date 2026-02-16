import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EDUCATION_RESOURCES } from "@/lib/exerciseGifUrls"
import { Button } from "@fitlife/ui"
import { BookOpen, X } from "lucide-react"

export function EducationSection() {
  const [selectedResource, setSelectedResource] = useState<typeof EDUCATION_RESOURCES[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(EDUCATION_RESOURCES.map((r) => r.category)))],
    []
  )

  // Filter resources by category
  const filteredResources = useMemo(
    () => (activeCategory === "All" || !activeCategory
      ? EDUCATION_RESOURCES
      : EDUCATION_RESOURCES.filter((r) => r.category === activeCategory)),
    [activeCategory]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-4 py-8 bg-gradient-to-b from-transparent to-blue-500/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Exercise Guide & Variations
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Learn different exercise variations and techniques to maximize your workout
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat === "All" ? null : cat)}
              variant={!activeCategory && cat === "All" || activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource, idx) => (
              <motion.button
                key={resource.url}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => setSelectedResource(resource)}
                className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <img
                  src={resource.url}
                  alt={resource.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-xs font-semibold text-white truncate">{resource.name}</p>
                </div>
                <div className="absolute top-2 right-2 bg-blue-500/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {resource.category}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No resources found for this category</p>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedResource(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl max-h-[90vh] w-full"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 text-white transition-all"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  src={selectedResource.url}
                  alt={selectedResource.name}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Info */}
              <div className="mt-4 bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-white/10">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
                  {selectedResource.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400">
                    {selectedResource.category}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
                  Click on other thumbnails below to view different variations and techniques
                </p>
              </div>

              {/* Navigation - Show related thumbnails */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {EDUCATION_RESOURCES.filter((r) => r.category === selectedResource.category).slice(0, 5).map(
                  (resource) => (
                    <button
                      key={resource.url}
                      onClick={() => setSelectedResource(resource)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        resource.url === selectedResource.url
                          ? "border-blue-500 ring-2 ring-blue-500/50"
                          : "border-zinc-200 dark:border-white/10 hover:border-blue-500/50"
                      }`}
                    >
                      <img src={resource.url} alt={resource.name} className="w-full h-full object-cover" />
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
