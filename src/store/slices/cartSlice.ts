import { createSlice } from '@reduxjs/toolkit'
const initial = { items: [] as any[] }
const slice = createSlice({
  name:'cart',
  initialState: initial,
  reducers: {
    addToCart(state, action){ const it = action.payload; const ex = state.items.find(i=>i.productId===it.productId); if(ex) ex.qty+=it.qty; else state.items.push(it); localStorage.setItem('cart', JSON.stringify(state.items)) },
    removeFromCart(state, action){ state.items = state.items.filter(i=>i.productId!==action.payload); localStorage.setItem('cart', JSON.stringify(state.items)) },
    loadCart(state){ const raw = localStorage.getItem('cart'); if(raw) state.items = JSON.parse(raw) },
    clearCart(state){ state.items = []; localStorage.removeItem('cart') }
  }
})
export const { addToCart, removeFromCart, loadCart, clearCart } = slice.actions
export default slice.reducer
