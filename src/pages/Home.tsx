import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchProducts } from "../store/slices/productsSlice"
import ProductCard from "../components/ProductCard"
import ProductFilters from "../components/productFilters"
import ProductSkeleton from "../components/common/skeleton"
import Pagination from "../components/common/pagination"
import { motion, AnimatePresence } from "framer-motion"
import { useDebounce } from "../customHooks/useDebounce"

export default function Home() {
  const dispatch = useAppDispatch()
  const { items: products, status, page, total, limit } = useAppSelector(s => s.products)
  const [filters, setFilters] = useState({})
  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    dispatch(fetchProducts({ ...debouncedFilters, page, limit }))
  }, [dispatch, debouncedFilters, page, limit])

  return (
    <div className="container py-8">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Products</h1>
      </motion.header>

      <ProductFilters onChange={setFilters} />

      {/* Product Grid */}
      <motion.div layout className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {status === "loading"
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : (
            <AnimatePresence>
              {products.map((p: any) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard p={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
      </motion.div>

      {/* Pagination */}
      <Pagination
        page={page}
        total={total}
        limit={limit}
        onChange={(newPage) => dispatch(fetchProducts({ ...debouncedFilters, page: newPage, limit }))}
      />
    </div>
  )
}
