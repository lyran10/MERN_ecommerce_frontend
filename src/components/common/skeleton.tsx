import React from "react"
import { motion } from "framer-motion"

export default function ProductSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card animate-pulse"
    >
      <div className="h-48 bg-gray-300 rounded-md mb-3" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-6 bg-gray-300 rounded w-16" />
        <div className="h-8 bg-gray-300 rounded w-20" />
      </div>
    </motion.div>
  )
}
