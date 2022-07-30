import React, {useState, Fragment, useEffect} from 'react';
import {auth, db} from '../config-firebase/firebase'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login, selectUser, getUserData} from "../redux/user/userSlice";
import {Link} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {setAlert, removeAlert} from "../redux/alerts/alertsSlice";
import ReactGA from "react-ga4";

// material ui imports for styling
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 5,
    marginTop: 10
}));

function Login() {
    const user = useSelector(selectUser)
    useEffect(() => {
        ReactGA.initialize('G-9ZG76GPGQF')
    }, []);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginToApp = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then(userAuth =>{
                dispatch(login({
                    email: userAuth.user.email,
                    uid: userAuth.user.uid,
                    displayName: userAuth.user.displayName
                }))

                const docRef = doc(db, "usersData", userAuth.user.uid);
                const docSnap = getDoc(docRef).then((x)=>{
                    dispatch(getUserData({
                        premium: x.data().premium
                    }))
                })
            }).catch(error =>alert(error.message))
    }
    const dispatch = useDispatch()

    const [values, setValues] = useState({
        showPassword: false,
    });

    const resetPasswordLink = (e) => {
        e.preventDefault()
        dispatch(setAlert('Revisa tu correo electronico', 'success'))
        sendPasswordResetEmail(auth, email).then(()=>handleClose())
        setTimeout(()=>{dispatch(removeAlert())}, 5000)
    }

    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    const formDialog = (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New password request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your email to receive a link to create a new password for your account.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email"
                        type="email"
                        name='email'
                        onChange={e => setEmail(e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={resetPasswordLink}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

    if(user){
        return <Navigate to='/'/>
    }
    return (
        <Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black'}}>
                                Login to your account
                            </Typography>
                            <Typography variant="h6" gutterBottom style={{marginBottom: 10, color: '#22223b'}}>
                                not registered?
                                <Link to='/register' style={{textDecoration: 'none', color: 'blue'}}> Create account
                                </Link>
                            </Typography>

                            <form onSubmit={loginToApp} style={{marginTop: 10}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Email"
                                                name="email"
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                label="Password"
                                                type={values.showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                name="password"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Login</Button>
                                    </Grid>
                                </Grid>
                            </form>

                            <Button onClick={()=> setOpen(!open)} style={{margin: 10}} type="submit" variant="outlined" color="error">Forgot your password?</Button>

                            {open?
                                <>{formDialog}</>
                                :
                                null
                            }
                        </Item>
                    </Grid>

                    <Grid item sm={11} lg={7} xs={11} style={{marginBottom: 20}}>
                        <Item elevation={4}>
                            <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/tz1Artboard+1.png" alt="logo" style={{width: 45, height: "auto"}}/>
                            <Typography style={{color: 'black', fontSize:'14px'}}>
                                Copyright © 2018-2022 Quinielasligamx. All rights reserved.
                            </Typography>
                            {/*<Grid container direction="row" justify="center" alignItems="center">*/}
                            {/*    <Grid item xs={4} sm={4} lg={4}>*/}
                            {/*        <Typography variant="subtitle1" gutterBottom>*/}
                            {/*            <Link to='/privacy' style={{color: 'blue', textDecoration: 'none', fontSize:'14px'}}>*/}
                            {/*                Privacy*/}
                            {/*            </Link>*/}
                            {/*        </Typography>*/}
                            {/*    </Grid>*/}

                            {/*    <Grid item xs={4} sm={4} lg={4}>*/}
                            {/*        <Typography variant="subtitle1" gutterBottom>*/}
                            {/*            <Link to='/terms' style={{color: 'blue', textDecoration: 'none', fontSize:'14px'}}>*/}
                            {/*                Terms*/}
                            {/*            </Link>*/}
                            {/*        </Typography>*/}
                            {/*    </Grid>*/}

                            {/*    <Grid item xs={4} sm={4} lg={4}>*/}
                            {/*        <Typography variant="subtitle1" gutterBottom>*/}
                            {/*            <Link to='/about' style={{color: 'blue', textDecoration: 'none', fontSize:'14px'}}>*/}
                            {/*                About*/}
                            {/*            </Link>*/}
                            {/*        </Typography>*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}

                        </Item>
                    </Grid>
                </Grid>
            </Box>

        </Fragment>
    );
}

export default Login;