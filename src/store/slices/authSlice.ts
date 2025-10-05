import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api'

export const firebaseLogin = createAsyncThunk(
  'auth/authLogin',
  async (payload: { idToken?: string; email?: string; password?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/firebase-login', payload)
      console.log(res.data)
      return res.data // { message, user, token }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Login failed ❌" })
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/logout')
    return res.data // { message }
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: "Logout failed ❌" })
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: localStorage.getItem('token') || null, 
    status: 'idle', 
    username: localStorage.getItem("username") || null, 
    role: localStorage.getItem("role"),
    message: null // <-- add message here
  },
  reducers: {},
  extraReducers: builder => {
    // ✅ firebaseLogin
    builder.addCase(firebaseLogin.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.message = action.payload.message || "Login successful 🎉"

      if (action.payload.token) localStorage.setItem('token', action.payload.token)
      if (action.payload.user) {
        state.username = action.payload.user.name
        state.role = action.payload.user.role
        localStorage.setItem('username', action.payload.user.name)
        localStorage.setItem('role', action.payload.user.role)
      }
    })
    builder.addCase(firebaseLogin.rejected, (state, action: any) => {
      state.message = action.payload?.message || "Login failed ❌"
    })

    // ✅ logout
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = null
      state.token = null
      state.username = null
      state.role = null
      state.message = action.payload?.message || "Logged out successfully 👋"

      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
    })
    builder.addCase(logout.rejected, (state, action: any) => {
      state.message = action.payload?.message || "Logout failed ❌"
    })
  }
})

export default slice.reducer
