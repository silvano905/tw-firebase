import React, {useState} from "react";
import { Stream } from "@cloudflare/stream-react";
import {db} from '../../config-firebase/firebase'
import {
    arrayUnion,
    doc, getDoc,
    increment,
    updateDoc
} from 'firebase/firestore'
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

const VideoComp = ({post, currentUser, userData}) => {
    const dispatch = useDispatch()

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

    const onVideoPlay = (e) => {
        e.preventDefault()
        //increase views by 1
        let refDoc = doc(db, 'posts', post.id)
        updateDoc(refDoc, {
            views: increment(1)
        }).then()
        if(currentUser){
            updateDoc(refDoc, {
                watched: arrayUnion(currentUser.uid)
            }).then(()=>{
                let updated = doc(db, 'posts', post.id)
                const docSnap = getDoc(updated).then((x)=>{
                    if(x.data().section==='single'){
                        dispatch(updateUnwatchedPosts({
                            id: x.id, data: x.data()
                        }))
                    }else {
                        dispatch(updateUnwatchedCompilations({
                            id: x.id, data: x.data()
                        }))
                    }
                })
            })
        }
        if(post.data.section==='single'){
            dispatch(setLastVideoPlayed(post.id))
        }else {
            dispatch(setLastCompilationPlayed(post.id))
        }


    }

    const onVideoEnd = (e) =>{
        e.preventDefault()
        //if the user is authenticated remove the current video from unwatched
        if(currentUser){
            if(post.data.section==='single'){
                dispatch(removeUnwatchedPosts(currentUser.uid))
            }

            if(post.data.section === 'compilations'&&index === post.data.videoIds.length-1){
                dispatch(removeUnwatchedCompilations(currentUser.uid))
            }
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
                        <Stream controls src={post.data.videoIds[index]} onPlay={onVideoPlay} onEnded={onVideoEnd}/>

                        :
                        !post.data.videoIds[index].premium?
                            <Stream controls src={post.data.videoIds[index]} onPlay={onVideoPlay} onEnded={onVideoEnd}/>
                            :
                            <div style={{position: "relative"}}>
                                <Stream src={post.data.videoIds[index]} onPlay={onVideoPlay} onEnded={onVideoEnd}/>
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
                        <Stream controls src={post.data.videoId} onPlay={onVideoPlay} onEnded={onVideoEnd}/>

                        :
                        !post.data.premium?
                            <>
                                <Typography variant="h6" gutterBottom>
                                    {post.data.title}
                                </Typography>
                                <Stream controls src={post.data.videoId} onPlay={onVideoPlay} onEnded={onVideoEnd}/>
                            </>
                            :
                            <div style={{position: "relative"}}>
                                <Stream src={post.data.videoId} onPlay={onVideoPlay} onEnded={onVideoEnd}/>
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