import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishListSlice'
import { motion } from 'framer-motion'
import { addToCart } from '../store/slices/cartSlice'
import { showToast } from '../store/slices/toastSlice'

export default function Wishlist() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(s => s.wishlist.items)

  useEffect(() => {
    dispatch(fetchWishlist())
  }, [items.length])

  if (!items.length) return <div className="container py-8">No items in wishlist</div>

  // Remove from wishlist with backend message
  const handleRemove = async (id: string) => {
    try {
      const res: any = await dispatch(removeFromWishlist(id)).unwrap()
      dispatch(showToast({ message: res.message, type: res.status }))
    } catch (err) {
      dispatch(showToast({ message: "Failed to remove product.", type: "error" }))
    }
  }

  // Add to cart (assuming backend returns a message if you integrate it)
  const handleAddToCart = (p: any) => {
    try {
      dispatch(
        addToCart({
          productId: p._id,
          title: p.title,
          price: p.price,
          qty: 1,
          image: p.images?.[0],
        })
      ) // if your addToCart thunk returns a message from backend
      dispatch(showToast({ message: "Added to cart successfully!", type: "success" }))
    } catch (err) {
      dispatch(showToast({ message: "Failed to add to cart.", type: "error" }))
    }
  }

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((p: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card relative"
          >
            <img src={p.images?.[0]} alt={p.title} className="h-48 w-full object-cover rounded" />
            <h3 className="mt-3 font-semibold">{p.title}</h3>
            <p className="text-gray-500">{p.category}</p>
            <div className="mt-2 font-bold">₹{p.price}</div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRemove(p._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              ✕ Remove
            </motion.button>

            <button
              onClick={() => handleAddToCart(p)}
              className="btn mt-5"
            >
              Add to cart
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
