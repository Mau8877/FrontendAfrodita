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
    toggle: (state) => { state.isOpen = !state.isOpen },
    open: (state) => { state.isOpen = true },
    close: (state) => { state.isOpen = false },
  }
})

export const { toggle, open, close } = sidebarSlice.actions
export default sidebarSlice.reducer