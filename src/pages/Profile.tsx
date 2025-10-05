import React, { useEffect } from 'react'
import { useAppSelector } from '../hooks'
import { useAppDispatch } from '../hooks'
import { fetchMyOrders } from '../store/slices/ordersSlice'

export default function Profile(){
  const user = useAppSelector(s=>s.auth.user)
  const orders = useAppSelector(s=>s.orders.items)
  const dispatch = useAppDispatch()
  useEffect(()=>{ dispatch(fetchMyOrders()) }, [dispatch])
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="mb-6"><div className="font-medium">{user?.name}</div><div className="text-sm text-gray-600">{user?.email}</div></div>
      <h2 className="text-xl font-semibold mb-2">Orders</h2>
      <div className="space-y-3">{orders.map((o:any)=>(<div key={o._id} className="p-3 border rounded bg-white/60">Order #{o._id} - ₹{o.total}</div>))}</div>
    </div>
  )
}
