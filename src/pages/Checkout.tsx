import React from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { createOrder } from '../store/slices/ordersSlice'
import { clearCart } from '../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../store/slices/toastSlice'

export default function Checkout(){
  const items = useAppSelector(s=>s.cart.items)
  const {token} = useAppSelector(s=>s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const total = items.reduce((s:any,i:any)=>s + i.price * i.qty, 0)


  const handlePlace = async () => {

    if(!token){
      dispatch(showToast({ message: "Please sign in to place an order ⚠️", type: "error" }))
      navigate('/signin') // optional: redirect to sign-in page
      return
    }
  try {
    await dispatch(
      createOrder({ 
        items, 
        total, 
        shippingAddress: {}, 
        paymentInfo: { method: 'mock' } 
      })
    ).unwrap()  // catch errors from asyncThunk

    dispatch(clearCart())
    dispatch(showToast({ message: "Order placed successfully!", type: "success" }))
    navigate('/profile')
  } catch (err) {
    dispatch(showToast({ message: "Failed to place order.", type: "error" }))
  }
}

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div>Order total: ₹{total.toFixed(2)}</div>
      <button onClick={handlePlace} className="mt-4 btn">Place order (mock)</button>
    </div>
  )
}
