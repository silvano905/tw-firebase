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

function CreatePost() {
    const user = useSelector(selectUser)

    useEffect(() => {
    }, []);
    const [videoIds, setVideoIds] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        views: 0,
        likes:0,
        videoId: '',
        premium: false,
        folder: ''
    });

    const [disableButton, setDisableButton] = useState(false)

    const onChangeVideoIds = (e) => {
        setVideoIds(current => [...current, formData.videoId]);
        setFormData({...formData, videoId: ''})
    }

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const { title, premium, videoId, views, folder, likes } = formData;

    const register = (e) => {
        e.preventDefault()
        setDisableButton(true)
        addDoc(collection(db, "posts"), {
            title: title,
            videoId: videoIds.length>0?'':videoId,
            videoIds: videoIds,
            views: parseInt(views),
            premium: premium,
            section: videoIds.length>0?'compilations':'single',
            watched: [],
            likes: likes,
            folder: folder,
            likedByUser: [],
            timestamp: serverTimestamp()
        }).then(()=>{
            setFormData({title: '', premium: false, folder: '', views: 0, videoId: '', likes: 0})
            setVideoIds([])
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
                                Create Post
                            </Typography>

                            <form onSubmit={register} style={{marginTop: 10}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Title"
                                                name="title"
                                                inputProps={{ maxLength: 25 }}
                                                value={title}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl style={{width: 200}}>
                                            <InputLabel id="demo-simple-select-label">Folder</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={folder}
                                                label="Age"
                                                name='folder'
                                                required
                                                onChange={onChange}
                                            >
                                                <MenuItem value='tiktok'>TikTok</MenuItem>
                                                <MenuItem value='instagram'>Instagram</MenuItem>
                                                <MenuItem value='triller'>Triller</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>


                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Video ID"
                                                name="videoId"
                                                value={videoId}
                                                onChange={onChange}
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
                                                label="Views"
                                                name="views"
                                                value={views}
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
                                                label="Likes"
                                                name="likes"
                                                value={likes}
                                                onChange={onChange}
                                                required
                                                style={{marginTop: 10}}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={7} lg={7} xs={9}>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={premium} onChange={()=>setFormData({ ...formData, premium: !premium })} name="premium" />
                                            }
                                            label="Premium video?"
                                        />
                                    </Grid>
                                    <Grid item sm={9} lg={8} xs={9}>
                                        <Button style={{margin: 10}} onClick={onChangeVideoIds} variant="contained" color="primary">add another video id</Button>
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

export default CreatePost;