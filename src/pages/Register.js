import React, {useState, Fragment, useEffect} from 'react';
import {auth, db} from '../config-firebase/firebase'
import { createUserWithEmailAndPassword, updateProfile,  } from 'firebase/auth'
import {doc, setDoc} from "firebase/firestore";
import {useDispatch, useSelector} from "react-redux";
import {login, selectUser, getUserData} from "../redux/user/userSlice";
import {Link, Navigate} from "react-router-dom";
import './Register.css'
// material ui
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import ReactGA from "react-ga4";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
}));

function Register() {
    const user = useSelector(selectUser)

    useEffect(() => {
        ReactGA.initialize('G-9ZG76GPGQF')
    }, []);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    //password
    const [values, setValues] = React.useState({
        password: '',
        showPassword: false
    });

    const { name, email, password } = formData;
    const [disableButton, setDisableButton] = useState(false)

    const register = (e) => {
        e.preventDefault()
        setDisableButton(true)
        createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                let userDataRef = doc(db, "usersData", cred.user.uid);
                setDoc(userDataRef,{
                    premium: false
                }).then(()=>{
                    dispatch(getUserData({premium: false}))
                })
                setDisableButton(false)
                updateProfile(cred.user, {displayName: name}).then(()=>{
                    dispatch(login({
                        email: email,
                        uid: cred.user.uid,
                        displayName: name
                    }))
                })
                })
                .catch(err => {
                    console.log(err.message)
                })
    }
    const dispatch = useDispatch()

    const [show, setShow] = useState({
        showInfo: false,
    });
    const { showInfo } = show;


    if(user){
        return <Navigate to='/'/>
    }

    return (
        <Fragment>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                                You need an account to like videos
                            </Typography>

                            <div>
                                <Button onClick={() => setShow({ ...show, showInfo: !showInfo })} variant="contained" style={{margin: 10}}>Anonymous account?</Button>
                                {show.showInfo ?
                                    <Typography variant="body1" gutterBottom style={{color: 'black', marginTop: 10}}>
                                        You can open an anonymous account by providing a fake email. Disclaimer, if
                                        you don't provide a real email you won't be able to reset your password if you forget it. Make
                                        sure you will remember your password and fake email to login.
                                    </Typography>
                                    : null
                                }
                            </div>

                            <Typography  variant="h6" gutterBottom style={{marginBottom: 10, color: '#22223b'}}>
                                Already registered?
                                <Link to='/login' style={{textDecoration: 'none', color: 'blue'}}> Login
                                </Link>
                            </Typography>

                            <form onSubmit={register} style={{marginTop: 10}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic"
                                                label="username"
                                                name="name"
                                                inputProps={{ maxLength: 20 }}
                                                value={name}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={7} lg={7} xs={9}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic3"
                                                label="email"
                                                name="email"
                                                value={email}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item sm={7} lg={7} xs={9}>
                                        <FormControl>
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                label="Password"
                                                type={values.showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                name="password"
                                                value={password}
                                                onChange={onChange}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={9} lg={8} xs={9}>
                                        {disableButton?
                                            <Button style={{margin: 10}} type="submit" variant="contained" color="primary" disabled>Register</Button>
                                            :
                                            <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Register</Button>
                                        }
                                    </Grid>


                                </Grid>
                            </form>
                        </Item>
                    </Grid>

                    <Grid item sm={11} lg={7} xs={11} style={{marginBottom: 20}}>
                        <Item elevation={4}>
                            <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/tz1Artboard+1.png" alt="logo" style={{width: 45, height: "auto"}}/>
                            <Typography style={{color: 'black', fontSize:'14px'}}>
                                Copyright © 2018-2022 tiktokteenthots. All rights reserved.
                            </Typography>

                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Fragment>
    );
}

export default Register;