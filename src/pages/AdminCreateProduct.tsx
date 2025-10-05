import React, { useState, useEffect } from "react"
import { useAppDispatch } from "../hooks"
import { createProduct, updateProduct } from "../store/slices/productsSlice"
import { motion } from "framer-motion"
import api from "../api"
import { useParams } from "react-router-dom"
import { showToast } from "../store/slices/toastSlice"

export default function AdminProductForm() {
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: ""
  })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then(res => {
        const p = res.data.product
        setForm({
          title: p.title,
          description: p.description,
          price: String(p.price),
          category: p.category,
          brand: p.brand,
          stock: String(p.stock)
        })
        setPreview(p.images?.[0] || "")
      })
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(selectedFile)
  }

  const formatText = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title || !form.category || !form.brand) {
      dispatch(showToast({ message: "Title, Category, Brand are required!", type: "error" }))
      return
    }
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      dispatch(showToast({ message: "Price must be a valid number!", type: "error" }))
      return
    }
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      dispatch(showToast({ message: "Stock must be a valid number!", type: "error" }))
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("title", formatText(form.title))
    formData.append("description", form.description)
    formData.append("price", String(Number(form.price)))
    formData.append("stock", String(Number(form.stock)))
    formData.append("category", formatText(form.category))
    formData.append("brand", formatText(form.brand))
    if (file) formData.append("image", file)

    try {
      if (id) {
        const res: any = await dispatch(updateProduct({ id, payload: formData })).unwrap()
        dispatch(showToast({ message: res.message, type: "success" }))
      } else {
        const res: any = await dispatch(createProduct(formData)).unwrap()
        dispatch(showToast({ message: res.message, type: "success" }))
      }
    } catch (err: any) {
      dispatch(showToast({ message: err.message || "Something went wrong!", type: "error" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">
          {id ? "Edit Product" : "Create Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-3 rounded"/>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-3 rounded"/>
          <div className="grid grid-cols-2 gap-4">
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-3 rounded"/>
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="border p-3 rounded"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-3 rounded"/>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="border p-3 rounded"/>
          </div>
          <div>
            <input type="file" name="image" onChange={handleImage} />
            {preview && <img src={preview} className="mt-3 w-48 h-48 object-cover rounded" alt="preview"/>}
          </div>
          <button disabled={loading} className="btn w-full flex items-center justify-center">
            {loading ? "Loading..." : id ? "Update Product" : "Create Product"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
