import React, { useState } from "react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "../firebase"
import { useAppDispatch } from "../hooks"
import { firebaseLogin } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { showToast } from "../store/slices/toastSlice"
import { Eye, EyeOff } from "lucide-react"

export default function SignIn() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const googleProvider = new GoogleAuthProvider()
  googleProvider.setCustomParameters({ prompt: "select_account" })

  // 🔹 Google login
  const handleGoogle = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      const res = await dispatch(firebaseLogin({ idToken: token })).unwrap()
      dispatch(showToast({ message: res.message || "Login successful 🎉", type: "success" }))
      navigate("/")
    } catch (err: any) {
      dispatch(showToast({ message: err?.message || "Google sign-in failed ❌", type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Email + Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      dispatch(showToast({ message: "Email & Password are required ⚠️", type: "error" }))
      return
    }
    try {
      setLoading(true)
      const res = await dispatch(firebaseLogin({ email, password })).unwrap()
      dispatch(showToast({ message: res.message || "Welcome back 🎉", type: "success" }))
      navigate("/")
    } catch (err: any) {
      dispatch(showToast({ message: err?.message || "Invalid credentials ❌", type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card shadow-lg p-6 text-center space-y-6"
      >
        <h1 className="text-3xl font-extrabold text-primary">Welcome Back</h1>
        <p className="text-gray-500">Sign in to continue shopping 🚀</p>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded focus:outline-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-3 rounded focus:outline-primary pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded font-semibold hover:opacity-90 transition"
          >
            {loading ? "Loading..." : "Sign in with Email"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <hr className="flex-grow border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>{loading ? "Loading..." : "Sign in with Google"}</span>
        </button>
      </motion.div>
    </div>
  )
}
