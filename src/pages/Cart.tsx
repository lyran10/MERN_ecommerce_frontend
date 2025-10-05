import React from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { removeFromCart } from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Cart(){
  const items = useAppSelector(s=>s.cart.items)
  const dispatch = useAppDispatch()
  const total = items.reduce((s:any,i:any)=>s + i.price * i.qty, 0)
  if(items.length===0) return <div className='container py-8'>Your cart is empty. <Link to="/">Shop now</Link></div>
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <motion.div className="space-y-4">
        {items.map((it:any)=>(
          <motion.div key={it.productId} initial={{opacity:0}} animate={{opacity:1}} className="p-4 border rounded flex items-center gap-4 bg-white/60">
            <img src={it.image||'https://via.placeholder.com/120'} className="w-24 h-24 object-cover rounded"/>
            <div className="flex-1"><h3 className="font-medium">{it.title}</h3><p>₹{it.price} x {it.qty}</p></div>
            <button onClick={()=>dispatch(removeFromCart(it.productId))} className="text-red-500">Remove</button>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-4 text-right">
        <div className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</div>
        <Link to="/checkout" className="inline-block mt-2 btn">Checkout</Link>
      </div>
    </div>
  )
}
