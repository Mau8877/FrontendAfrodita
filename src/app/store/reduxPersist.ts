import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '@/app/features/auth/store/authSlice'
import { headerReducer } from '@/components/layout/headerClient'
import { sidebarSlice as sidebarSliceClient } from '@/components/layout/sidebarClient'
import { sidebarSlice as sidebarSliceAdmin } from '@/components/layout/sidebarAdmin'
import { api } from './api'

// 1. Configuración de persistencia
const persistConfig = {
  key: 'afrodita-root',
  storage,
  whitelist: ['auth'], 
}

const rootReducer = combineReducers({
  auth: authReducer,
  header: headerReducer,
  sidebarClient: sidebarSliceClient.reducer,
  sidebarAdmin: sidebarSliceAdmin.reducer,
  [api.reducerPath]: api.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// 2. Creación del Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch