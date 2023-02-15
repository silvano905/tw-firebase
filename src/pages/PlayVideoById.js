import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
    doc,
    getDoc,
    updateDoc,
    increment,
    arrayUnion, deleteDoc
} from "firebase/firestore";
import ReactGA from "react-ga4";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from '@mui/material/CardMedia';
import Select from "@mui/material/Select";
import {useParams, useLocation, Navigate} from "react-router-dom";
import {Stream} from "@cloudflare/stream-react";
import Spinner from "../components/spinner/Spinner";
import {selectUser} from "../redux/user/userSlice";
import Stack from "@mui/material/Stack";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {db} from "../config-firebase/firebase";
import {setLastVideoPlayed, updateUnwatchedPosts} from "../redux/posts/postsSlice";
import {setLastCompilationPlayed, updateUnwatchedCompilations} from "../redux/compilations/compilationsSlice";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:5
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #02CC92 8%, #1283C9 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextTwo = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'black',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextThree = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #80ed99 30%, #57cc99 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const PlayVideoById = () => {
    const params = useParams();
    const [isLoading, setLoading] = useState(true);
    const currentUser = useSelector(selectUser)
    const location = useLocation();
    const post = location.state.obj
    const dispatch = useDispatch()

    useEffect(() => {
        ReactGA.initialize('G-PH7BM56H1X')
        ReactGA.send({ hitType: "pageview", page: location.pathname })
    }, [])

    const [index, setIndex] = useState(0)
    const loadNextVideo = () =>{
        if(index<post.data.videoIds.length-1){
            setIndex(prevState => prevState + 1)
        }

    }

    const loadPreviousVideo = () =>{
        if(index>0){
            setIndex(prevState => prevState - 1)
        }
    }

    const likePost = (e) => {
        e.preventDefault()
        if(currentUser){
            let refDoc = doc(db, 'posts', post.id)
            updateDoc(refDoc, {
                likes: increment(1),
                likedByUser: arrayUnion(currentUser.uid)
            }).then()
        }

    }

    const onVideoPlay = (e) => {
        e.preventDefault()
        //increase views by 1
        ReactGA.event({
            category: 'Video',
            action: 'watched a video',
        });
        let refDoc = doc(db, 'posts', post.id)
        updateDoc(refDoc, {
            views: increment(1)
        }).then()
        if(post.data.section==='single'){
            dispatch(setLastVideoPlayed(post.id))
        }else {
            dispatch(setLastCompilationPlayed(post.id))
        }


    }

    return (
        <>
            {isLoading&& (
                <Spinner/>
            )}
            <Item elevation={4}>
                {post.data.videoIds.length>0?
                    <>
                        <Typography variant="h6" gutterBottom>
                            video compilation {index+1}/{post.data.videoIds.length}
                        </Typography>
                        <Stream controls src={post.data.videoIds[index]} onPlay={onVideoPlay} onCanPlay={() => setLoading(false)} />
                    </>
                    :post.data.cdn==='cloudflare'?
                        <Stream controls src={params.id} onPlay={onVideoPlay} onCanPlay={() => setLoading(false)} />
                        :
                            <Card sx={{ display: 'flex', margin: 5 }}>
                                <CardMedia
                                    onCanPlay={() => setLoading(false)}
                                    component="video"
                                    image={'https://d3sog3sqr61u3b.cloudfront.net/'+params.id}
                                    title="tiktok thots"
                                    controls
                                />
                            </Card>

                }

                <div style={{display: "flex", marginTop: 5, marginBottom: 5, flexWrap: "wrap", justifyContent: "center", alignItems: "center"}}>
                    {currentUser&&post.data.likedByUser.includes(currentUser.uid)?
                        <Stack direction="row" spacing={2} style={{margin: 5}}>
                            <Button variant="outlined" startIcon={<ThumbUpIcon style={{color: 'blue'}}/>}>
                                {post.data.likes}
                            </Button>
                        </Stack>
                        :
                        <Stack direction="row" spacing={2} style={{margin: 5}}>
                            <Button onClick={likePost} variant="outlined" startIcon={<ThumbUpIcon style={{color: 'black'}}/>}>
                                {post.data.likes}
                            </Button>
                        </Stack>
                    }

                    <Button variant="outlined">
                        views {post.data.views}
                    </Button>
                    {currentUser&&currentUser.uid==='JuWneKYgAFfQGy2ZkGwR0xz45XK2'&&
                        <Button style={{margin: 5}} variant="outlined" size="small" onClick={()=>{
                            deleteDoc(doc(db, 'posts', post.id)).then(()=><Navigate to='/'/>)
                        }}>delete</Button>
                    }

                </div>

                {post.data.videoIds.length>0&&
                    <div style={{display: "flex", marginTop: 5, marginBottom: 5, flexWrap: "wrap", justifyContent: "center", alignItems: "center"}}>
                        <Button style={{margin: 3}} size='small' onClick={loadPreviousVideo} disabled={index === 0} variant="outlined" startIcon={<ArrowBackIosNewIcon style={{color: 'blue'}}/>}>
                            previous video
                        </Button>

                        <Button style={{margin: 3}} size='small' onClick={loadNextVideo} disabled={index >= post.data.videoIds.length-1} variant="outlined" startIcon={<ArrowForwardIosIcon style={{color: 'blue'}}/>}>
                            next video
                        </Button>
                    </div>
                }
            </Item>

        </>
    );
};

export default PlayVideoById;