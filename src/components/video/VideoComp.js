import React, {Fragment, useEffect, useState} from "react";
import { Waypoint } from 'react-waypoint';
import { Stream } from "@cloudflare/stream-react";
import {db} from '../../config-firebase/firebase'
import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    increment, limit, onSnapshot, orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Divider from "@mui/material/Divider";
//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    background: '#fdfffc'
}));

const VideoComp = ({post, currentUser, userData}) => {

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

    const increaseViews = (e) => {
        e.preventDefault()
        let refDoc = doc(db, 'posts', post.id)
        updateDoc(refDoc, {
            views: increment(1)
        }).then()
        if(currentUser){
            updateDoc(refDoc, {
                watched: arrayUnion(currentUser.uid)
            }).then()
        }

    }

    return (
        <Item elevation={4} key={post.id}>
            {post.data.videoIds.length>0?
                <>
                    <Typography variant="h6" gutterBottom>
                        video compilation {index+1}/{post.data.videoIds.length}
                    </Typography>

                    {userData&&userData.premium&&post.data.videoIds[index].premium?
                        <Stream controls src={post.data.videoIds[index]} onPlay={increaseViews}/>

                        :
                        !post.data.videoIds[index].premium?
                            <Stream controls src={post.data.videoIds[index]} onPlay={increaseViews}/>
                            :
                            <div style={{position: "relative"}}>
                                <Stream src={post.data.videoIds[index]} onPlay={increaseViews}/>
                                <PlayCircleFilledWhiteIcon fontSize='inherit' style={{    left: 0,
                                    position:"absolute",
                                    textAlign: "center",
                                    fontSize: 100,
                                    top: '50%',
                                    color: "white",
                                    width: "100%"}}>play
                                </PlayCircleFilledWhiteIcon>
                            </div>


                    }

                </>
                :
                <>
                    {userData&&userData.premium&&post.data.premium?
                        <Stream controls src={post.data.videoId} onPlay={increaseViews}/>

                        :
                        !post.data.premium?
                            <Stream controls src={post.data.videoId} onPlay={increaseViews}/>
                            :
                            <div style={{position: "relative"}}>
                                <Stream src={post.data.videoId} onPlay={increaseViews}/>
                                <PlayCircleFilledWhiteIcon fontSize='inherit' style={{    left: 0,
                                    position:"absolute",
                                    textAlign: "center",
                                    fontSize: 100,
                                    top: '50%',
                                    color: "white",
                                    width: "100%"}}>play
                                </PlayCircleFilledWhiteIcon>
                            </div>
                    }
                </>

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


export default VideoComp;