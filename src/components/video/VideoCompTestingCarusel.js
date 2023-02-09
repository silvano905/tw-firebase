import React, {useState} from "react";
import { Stream } from "@cloudflare/stream-react";
import {db} from '../../config-firebase/firebase'
import {
    arrayUnion,
    doc, getDoc,
    increment,
    updateDoc
} from 'firebase/firestore'
import {Link, useLocation} from "react-router-dom";

import {removeUnwatchedCompilations, updateUnwatchedCompilations, setLastCompilationPlayed} from "../../redux/compilations/compilationsSlice";
import {removeUnwatchedPosts, updateUnwatchedPosts, setLastVideoPlayed} from "../../redux/posts/postsSlice";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {useDispatch} from "react-redux";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    background: '#fdfffc'
}));

const VideoCompTestingCarusel = ({post}) => {
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

    return (
        <Item elevation={4} key={post.id}>
            <Typography variant="h6" gutterBottom>
                video compilation {index+1}/{post.data.videoIds.length}
            </Typography>


            <div style={{position: "relative"}}>
                <Link to={`/video/${post.data.videoIds[index]}`} state={{ obj: post }} style={{textDecoration: 'none'}}>
                    <img src={"https://customer-902gofmdxw3ulpi6.cloudflarestream.com/" + post.data.videoIds[index] + "/thumbnails/thumbnail.gif?time=1s&height=500&duration=4s"} />
                    <PlayCircleFilledWhiteIcon fontSize='inherit' style={{    left: 0,
                        position:"absolute",
                        textAlign: "center",
                        fontSize: 100,
                        top: '40%',
                        color: "white",
                        width: "100%"}}>play
                    </PlayCircleFilledWhiteIcon>
                </Link>
            </div>


            <div style={{display: "flex", marginTop: 5, marginBottom: 5, flexWrap: "wrap", justifyContent: "center", alignItems: "center"}}>

                <Stack direction="row" spacing={2} style={{margin: 5}}>
                    <Button variant="outlined" startIcon={<ThumbUpIcon style={{color: 'black'}}/>}>
                        {post.data.likes}
                    </Button>
                </Stack>

                <Button variant="outlined">
                    views {post.data.views}
                </Button>

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
    )

};


export default VideoCompTestingCarusel;