import React from 'react'
export default function Footer(){
  return (
    <footer className="mt-12 py-6 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} E-Store • Built with MERN • Animated UI
    </footer>
  )
}
