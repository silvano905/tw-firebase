import React, {useState, Fragment, useEffect} from 'react';
import {db} from '../config-firebase/firebase'
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../redux/user/userSlice";
import {Navigate} from "react-router-dom";
import './Register.css'
// material ui
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 8,
    marginTop: 11,
    marginBottom:10
}));

function CreateTumblr() {
    const user = useSelector(selectUser)

    useEffect(() => {
    }, []);
    const [formData, setFormData] = useState({
        url: ''
    });

    const [disableButton, setDisableButton] = useState(false)


    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const { url } = formData;

    const register = (e) => {
        e.preventDefault()
        setDisableButton(true)
        addDoc(collection(db, "tumblr"), {
            url: url,
            timestamp: serverTimestamp()
        }).then(()=>{
            setFormData({url: ''})
            setDisableButton(false)
        })

    }

    if(!user||user.uid!=='JuWneKYgAFfQGy2ZkGwR0xz45XK2'){
        return <Navigate to='/'/>
    }
    return (
        <Fragment>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h5" gutterBottom style={{color: 'black', marginTop: 10}}>
                                Embed Tumblr Video
                            </Typography>

                            <form onSubmit={register} style={{marginTop: 10}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Url"
                                                name="url"
                                                inputProps={{ maxLength: 25 }}
                                                value={url}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={9} lg={8} xs={9}>
                                        <Button style={{margin: 10}} type="submit" variant="contained" color="primary">Create</Button>
                                    </Grid>


                                </Grid>
                            </form>
                        </Item>
                    </Grid>

                </Grid>
            </Box>
        </Fragment>
    );
}

export default CreateTumblr;