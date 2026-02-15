import { createSlice } from '@reduxjs/toolkit'

// Definimos el estado inicial del header
interface HeaderState {
  isSidebarOpen: boolean
}

const initialState: HeaderState = {
  isSidebarOpen: false, // Empieza cerrado
}

export const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true
    },
  },
})

// Exportamos acciones y el reducer
export const { toggleSidebar, closeSidebar, openSidebar } = headerSlice.actions
export default headerSlice.reducer