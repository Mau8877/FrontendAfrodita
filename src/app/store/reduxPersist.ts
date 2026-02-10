import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Usa localStorage por defecto
import authReducer from '@/app/features/auth/store/authSlice' // Importamos el que acabamos de crear
import { api } from './api' // Importamos la API (la crearemos/ajustaremos luego)

// 1. Configuración de persistencia (para no perder sesión al recargar)
const persistConfig = {
  key: 'afrodita-root', // Nombre único para tu app
  storage,
  whitelist: ['auth'], // Solo guardamos auth, lo demás se borra al recargar
}

const rootReducer = combineReducers({
  auth: authReducer, // Aquí registramos el slice de auth
  [api.reducerPath]: api.reducer, // Aquí registramos la API
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// 2. Creación del Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necesario para redux-persist
    }).concat(api.middleware), // Agregamos el middleware de RTK Query
})

export const persistor = persistStore(store)

// 3. Tipos globales para TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch