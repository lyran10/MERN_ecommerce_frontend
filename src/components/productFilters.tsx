// productFilters.tsx
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

type Props = { onChange: (filters: any) => void }

export default function ProductFilters({ onChange }: Props) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  useEffect(() => {
    onChange({ search, category, brand, min, max })
  }, [search, category, brand, min, max])

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="card p-4 mb-6 space-y-3"
    >
      <input
        type="text"
        placeholder="Search by title..."
        className="w-full border rounded px-3 py-2"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Category"
          className="border rounded px-3 py-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Brand"
          className="border rounded px-3 py-2"
          value={brand}
          onChange={e => setBrand(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Min Price"
          className="border rounded px-3 py-2"
          value={min}
          onChange={e => setMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="border rounded px-3 py-2"
          value={max}
          onChange={e => setMax(e.target.value)}
        />
      </div>
    </motion.div>
  )
}
