import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react';
import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../graphql/mutation';

export const LoginPage = () => {
    const [loginUser, { loading, data, error }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            localStorage.setItem('jwt', JSON.stringify(data.loginUser.token))
        }
    })
    const [formData, setFormData] = useState({});
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const submitData = async (e) => {
        e.preventDefault()
        await loginUser({
            variables: {
                input: formData
            }
        })
    }
    return (
        <Paper sx={{ width: "600px", marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto', padding: '2rem' }}>
            <Box component='form' onSubmit={submitData}>

                <Stack spacing={2}>
                    <Typography textAlign='center' variant='h3'>Login</Typography>
                    <TextField name="email" className="outlined-basic" label="Email" variant="outlined" onChange={handleChange} />
                    <TextField name="password" type='password' className="outlined-basic" label="Password" variant="outlined" onChange={handleChange} />
                    <Button disabled={loading} size='large' variant='contained' type='submit'>{loading ? "Data being processed..." : "Login"}</Button>
                    {data && <Alert severity='success'>{' You are successfully logged in'}</Alert>}
                    {error && <Alert severity='error'>{error.message}</Alert>}
                </Stack>

            </Box>
        </Paper>
    )
}
