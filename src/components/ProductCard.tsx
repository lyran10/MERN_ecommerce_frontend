import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { addToWishlist } from '../store/slices/wishListSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { showToast } from '../store/slices/toastSlice'

export default function ProductCard({p}:{p:any}){
  const dispatch = useAppDispatch()
  const {role, token} = useAppSelector((s) => s.auth)
  
  const handleAddToWishlist = async (productId: string) => {
  try {
    // dispatch the wishlist action
    await dispatch(addToWishlist(productId)).unwrap() // unwrap to catch errors
    dispatch(showToast({ message: "Added to wishlist successfully!", type: "success" }))
  } catch (err) {
    dispatch(showToast({ message: "Something went wrong!", type: "error" }))
  }
}

  return (
    <motion.div whileHover={{scale:1.03, y:-4}} className="card">
      <Link to={`/product/${p._id}`} className="block">
        <div className="h-48 overflow-hidden rounded-md">
         <img 
          src={p.images?.[0] ? `${p.images[0]}` : ''} 
          alt={p.title} 
          className="w-full h-full object-cover"
        />
        </div>
        <h3 className="mt-3 font-semibold">{p.title}</h3>
        <p className="text-sm">{p.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-bold">₹{p.price}</div>
          <button className="btn">View</button>
        </div>
      </Link>

      {
        token
        ?
        <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => handleAddToWishlist(p._id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
      >
        ♥
      </motion.button>
        :
        null
      }
     

       {role === "admin" && (
        <Link
          to={`/admin/edit/${p._id}`}
          className="mt-2 inline-block text-sm text-blue-600 hover:underline"
        >
          ✏️ Edit
        </Link>
      )}
    </motion.div>
  )
}
