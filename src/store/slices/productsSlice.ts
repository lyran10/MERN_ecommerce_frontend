import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'

export const fetchProducts = createAsyncThunk('products/fetch', async (params:any={}) => {
  const res = await api.get('/products', { params })
  console.log(res.data)
  return res.data
})

export const createProduct = createAsyncThunk('products/create', async (payload:any) => {
  const res = await api.post('/admin/product', payload)
  return res.data
})

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, payload }: { id: string; payload: any }) => {
    const res = await api.put(`/admin/product/${id}`, payload)
    return res.data
  }
)

// Fetch reviews for a product
export const fetchReviews = createAsyncThunk('products/fetchReviews', async (productId: string) => {
  const res = await api.get(`/products/${productId}`)
  return res.data
})

// Add a new review
export const addReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, payload }: { productId: string; payload: any }) => {
    const res = await api.post(`/products/${productId}/reviews`, payload)
    return { productId, review: res.data, message: res.data.message || "Review submitted successfully!", }
  }
)

const slice = createSlice({
  name:'products',
  initialState: { items: [] as any, total:0, page : 1, limit : 12, status:'idle' as string, current: null as any, loading : "string"  },
  reducers:{},
  extraReducers: builder => {
     builder.addCase(fetchProducts.pending, (state) => {
    state.loading = "loading"
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      console.log(action.payload)
      state.loading = "succeeded"
      state.items = action.payload.products
      state.total = action.payload.total
      state.page = action.payload.page
      state.limit = action.payload.limit
    })
    builder.addCase(fetchProducts.rejected, (state) => {
      state.loading = "failed"
    })

    builder.addCase(createProduct.fulfilled, (state, action)=>{ state.items.unshift(action.payload) })
    builder.addCase(updateProduct.fulfilled, (state, action) => {
     const idx = state.items.findIndex((p: any) => p._id === action.payload._id)
     if (idx >= 0) state.items[idx] = action.payload
    })
     builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.current = action.payload.product
    })
    builder.addCase(addReview.fulfilled, (state, action) => {
      if (state.current && state.current._id === action.payload.productId) {
        state.current.reviews.push(action.payload.review)
      }
    })
  }
})

export default slice.reducer
