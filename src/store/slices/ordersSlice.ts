import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api';

export const createOrder = createAsyncThunk('orders/create', async (payload:any)=>{ const res = await api.post('/orders', payload); return res.data })
export const fetchMyOrders = createAsyncThunk('orders/my', async ()=>{ const res = await api.get('/orders/me'); return res.data })

const slice = createSlice({
  name: 'orders',
  initialState: { items: [] as any[], status: 'idle' as string },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.items.push(action.payload)
    })
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.items = action.payload
    })
  }
})

export default slice.reducer
