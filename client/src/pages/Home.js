import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_USERS } from '../graphql/query'
import { UsersSideBar } from '../components/UsersSideBar';
import { Typography, Box, Paper } from '@mui/material';
import { useDispatch } from 'react-redux'
import { getUsers } from '../store/userReducer';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

export const Home = ({ current_user }) => {
    const { data, loading, error } = useQuery(GET_USERS);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers(data?.users))
    }, [dispatch, data])

    if (loading) {
        return <Typography variant="h3">Loading data...</Typography>
    }
    if (error) {
        return <Typography>{error.message}</Typography>
    }
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    return (
        <div>
            <Typography variant='h3'>{current_user?.firstName}</Typography>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid xs={12} sm={8} md={4}>
                        {data && <UsersSideBar users={data.users} />}
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}
