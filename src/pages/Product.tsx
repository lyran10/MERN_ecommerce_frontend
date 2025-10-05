import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchReviews, addReview } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import { motion } from 'framer-motion'
import { showToast } from '../store/slices/toastSlice'

export default function Product() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const product = useAppSelector(s => s.products.current)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const token = localStorage.getItem("token") || ""

  useEffect(() => {
    if (id) dispatch(fetchReviews(id))
  }, [id])

  if (!product) return <div className="container py-8">Loading...</div>

const handleSubmit = async () => {
  if (!text || !rating) {
    dispatch(showToast({ message: "Please add rating and review", type: "error" }))
    return
  }

  try {
    // If addReview is an async thunk created with createAsyncThunk
    const res = await dispatch(
      addReview({ productId: product._id, payload: { rating, text } })
    ).unwrap()  

    setRating(0)
    setText('')

    dispatch(showToast({ 
      message: res?.message || "Review submitted successfully!", 
      type: "success" 
    }))
  } catch (err: any) {
    dispatch(showToast({ 
      message: err?.message || "Failed to submit review.", 
      type: "error" 
    }))
  }
}


const handleAddToCart = () => {
  try {
    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        qty: 1,
        image: product.images?.[0],
      })
    )
    dispatch(showToast({ message: "Added to cart successfully!", type: "success" }))
  } catch (err) {
    dispatch(showToast({ message: "Failed to add to cart.", type: "error" }))
  }
}

  return (
    <div className="container py-8 space-y-8">
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/800'}
            className="w-full h-96 object-cover rounded"
            alt=""
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="mt-2 text-gray-600">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-2xl font-extrabold">₹{product.price}</div>
            <button
              onClick={handleAddToCart}
              className="btn"
            >
              Add to cart
            </button>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <h3 className="text-xl font-bold mb-4">Reviews & Ratings</h3>

        {/* Form */}
        {token ? (
        <div className="space-y-2 mb-6">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded p-2"
          />
          <button onClick={handleSubmit} className="btn bg-blue-600 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Please login to write a review.</p>
      )}

        {/* Reviews list */}
        <div className="space-y-4">
          {product.reviews?.length ? (
            product.reviews.map((r: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 border rounded shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{r.user?.name || 'Anonymous'}</div>
                  <div className="text-yellow-500">{'★'.repeat(r.rating)}</div>
                </div>
                <p className="text-gray-600">{r.text}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
