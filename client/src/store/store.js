import { configureStore } from '@reduxjs/toolkit'
import users from '../store/userReducer'
export const store = configureStore({
    reducer: { users },
})