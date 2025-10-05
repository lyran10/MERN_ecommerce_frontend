import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useAppDispatch, useAppSelector } from '../hooks'
import DarkToggle from './DarkToggle'
import { motion } from 'framer-motion'
import { logout } from '../store/slices/authSlice'
import { fetchWishlist } from '../store/slices/wishListSlice'

export default function Header(){
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector(s=>s.cart.items.length)
  const {username, token, role} = useAppSelector(s=>s.auth)
  const wishlistCount = useAppSelector(s => s.wishlist.items.length)

   useEffect(() => {
      dispatch(fetchWishlist())
    }, [])

  const handleLogout = async () => {
  await signOut(auth)
  dispatch(logout()) // clear redux auth state
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  localStorage.removeItem("role")
  navigate("/")
}

  return (
    <motion.header initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="bg-white/80 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="text-2xl font-extrabold text-primary">E‑Store</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/cart" className="relative">Cart <span className="ml-2 inline-block bg-primary text-white px-2 rounded-full text-xs">{cartCount}</span></Link>
          {
            role === "admin" &&  
            <>
             <Link to="/admin/create-product" className="hover:underline">Add Product</Link>
             <Link to="/admin/dashboard" className="bg-primary text-white px-3 py-1 rounded hover:opacity-90">
              Dashboard
            </Link>
            </>
          
          }
         
         {token ? (
              <>
              <Link to="/wishlist" className="relative">
                Wishlist <span className="ml-1 bg-pink-500 text-white px-2 rounded-full text-xs">{wishlistCount}</span>
              </Link>
                <Link to="/profile" className="ml-2">{username}</Link>
                <button 
                  onClick={handleLogout} 
                  className="ml-2 text-sm text-red-500 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/signin" className="ml-2">Sign in</Link>
            )}
          <DarkToggle />
        </nav>
      </div>
    </motion.header>
  )
}
