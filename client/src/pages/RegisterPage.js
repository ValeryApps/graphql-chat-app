import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react';
// import './auth.css'
import { useMutation } from '@apollo/client'
import { REGISTER_USER } from '../graphql/mutation';

export const RegisterPage = () => {
    const [registerUser, { loading, data, error }] = useMutation(REGISTER_USER)
    const [formData, setFormData] = useState({});
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const submitData = (e) => {
        e.preventDefault()
        registerUser({
            variables: {
                input: formData
            }
        }).then(d => {
            console.log(d);
        })
    }
    return (
        <Paper sx={{ width: "600px", marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto', padding: '2rem' }}>
            <Box component='form' onSubmit={submitData}>

                <Stack spacing={2}>
                    <Typography textAlign='center' variant='h3'>Create An Account</Typography>
                    <TextField className="outlined-basic" name='firstName' label="First Name" variant="outlined" onChange={handleChange} />
                    <TextField className="outlined-basic" name='lastName' label="Last Name" variant="outlined" onChange={handleChange} />
                    <TextField name="email" className="outlined-basic" label="Email" variant="outlined" onChange={handleChange} />
                    <TextField name="password" type='password' className="outlined-basic" label="Password" variant="outlined" onChange={handleChange} />
                    <Button disabled={loading} size='large' variant='contained' type='submit'>{loading ? "Data being processed..." : "Submit"}</Button>
                    {data && <Alert severity='success'>{data.registerUser.firstName + ' successfully registered'}</Alert>}
                    {error && <Alert severity='error'>{error.message}</Alert>}
                </Stack>

            </Box>
        </Paper>
    )
}
