import { List, Paper, Typography } from '@mui/material'
import React from 'react'
import { UserCard } from './UserCard';

export const UsersSideBar = ({ users }) => {

    return (
        <Paper sx={{ height: '100vh', padding: '10px' }}>
            <Typography textAlign='center' bgcolor='#ccc' sx={{ paddingTop: '10px', paddingBottom: '10px' }} variant='h5'>Users Online</Typography>
            <List>
                {users?.map(user => (
                    <div key={user.id}>
                        <UserCard user={user} />
                    </div>
                ))}
            </List>
        </Paper>
    )
}
