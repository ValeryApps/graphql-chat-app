import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    users: null
};
const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        getUsers: (state, action) => {
            // console.log(state.users);
            state.users = action.payload
        }
    }
})

export const { getUsers } = userSlice.actions

export default userSlice.reducer