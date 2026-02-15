import { createSlice } from '@reduxjs/toolkit'

interface SidebarState {
  isOpen: boolean
}

const initialState: SidebarState = {
  isOpen: false,
}

export const sidebarSlice = createSlice({
  name: 'sidebarAdmin',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen
    },
    close: (state) => {
      state.isOpen = false
    },
    open: (state) => {
      state.isOpen = true
    },
  },
})

export const { toggle, close, open } = sidebarSlice.actions
export default sidebarSlice.reducer