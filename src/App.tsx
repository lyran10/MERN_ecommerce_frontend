import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import AdminCreateProduct from './pages/AdminCreateProduct'
import AdminProductForm from './pages/AdminCreateProduct'
import Wishlist from './pages/wishList'
import { Toast } from './components/common/toast'
import AdminDashboard from './pages/adminDashboard'

export default function App(){

  return (
    <div className="min-h-screen flex flex-col relative">
      <Toast/>
      <Header />
   
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/product/:id" element={<Product/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/wishList" element={<Wishlist/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/admin/create-product" element={<AdminCreateProduct/>} />
          <Route path="/admin/edit/:id" element={<AdminProductForm />} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
