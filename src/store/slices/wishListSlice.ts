import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const res = await api.get('/wishlist');
  return res.data;
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId: string) => {
  const res = await api.post('/wishlist', { productId });
  return res.data;
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId: string) => {
  const res = await api.delete(`/wishlist/${productId}`);
  return res.data;
});

const slice = createSlice({
  name: 'wishlist',
  initialState: { items: [] as any[] },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      // console.log(action.payload.wishlist.products)
      state.items = action.payload.wishlist.products || [];
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.items = action.payload.wishlist.products;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.items = action.payload.wishlist.products;
    });
  }
});

export default slice.reducer;
