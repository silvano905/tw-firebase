import React, {useState, useEffect, useRef} from 'react';
import {useLocation} from "react-router-dom";
import VideoCompTestingCarusel from "../components/video/VideoCompTestingCarusel";
import {
    collection,
    query, orderBy, getDocs, where
} from "firebase/firestore";
import {Helmet} from "react-helmet";
import {getPosts, selectPosts, selectUnwatched, setUnwatchedPosts, selectLastPostPlayedId} from "../redux/posts/postsSlice";
import { Waypoint } from 'react-waypoint';
import {db} from '../config-firebase/firebase'
import Spinner from "../components/spinner/Spinner";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, selectUserData} from "../redux/user/userSlice";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReactGA from "react-ga4";
import {removeAlert, setAlert} from "../redux/alerts/alertsSlice";
import {
    getCompilations,
    selectCompilations,
    selectLastCompilationPlayedId
} from "../redux/compilations/compilationsSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc'
}));

function TestingCompilations() {
    const dispatch = useDispatch()
    const allPosts = useSelector(selectCompilations)
    const allUnwatchedCompilations = useSelector(selectUnwatched)
    const currentUser = useSelector(selectUser)
    const userData = useSelector(selectUserData)
    const lastCompilationPlayedId = useSelector(selectLastCompilationPlayedId)


    const [visible, setVisible] = useState(2)

    const [filterPosts, setFilterPosts] = useState('timestamp')
    const enterTriggered = useRef(false);

    const handleWaypointEnter = () => {
        if (enterTriggered.current) return;
        enterTriggered.current = true;
        if (visible < allPosts.length) {
            setVisible(prevState => prevState + 1);
        }
    };

    const handleWaypointLeave = () => {
        enterTriggered.current = false;
    };

    let location = useLocation()

    useEffect(() => {
        ReactGA.initialize('G-PH7BM56H1X')
        ReactGA.send({ hitType: "pageview", page: location.pathname })
        // if(!allPosts){
        let p = collection(db, 'posts')
        let order = query(p, orderBy(filterPosts, 'desc'), where("section", "==", 'compilations'))
        const querySnapshot = getDocs(order).then(x=>{
            dispatch(getCompilations(
                x.docs.map(doc => ({data: doc.data(), id: doc.id}))
            ))
        })
        // }
    }, [filterPosts,])


    //to scroll to tha last video played
    const pk = useRef(null)
    const[scrollDown, setScrollDown] = useState(false)
    const scrollToBottom = (e) => {
        setScrollDown(true)
        pk.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
        });
        setTimeout(()=>setScrollDown(false), 1000)
    };
    //end
    let elementPosition = 0
    if(allPosts&&allPosts.length>0&&scrollDown){
        elementPosition = allPosts.findIndex(object => {
            return object.id === lastCompilationPlayedId;
        });
        // if(elementPosition>=visible){
        //     setVisible(prevState => prevState + elementPosition)
        // }
    }
    let quinielasList;
    if(allPosts&&allPosts.length>0) {
        quinielasList = allPosts.slice(0, lastCompilationPlayedId&&scrollDown?elementPosition+1:visible).map(item => {
            return (
                <Grid item sm={4} lg={4} xs={12}>
                    <VideoCompTestingCarusel post={item} currentUser={currentUser} userData={userData}/>
                </Grid>
            )
        })

    }

    if(allPosts){
        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                <Grid item sm={11} lg={10} xs={11}>
                    <Item elevation={4}>
                        <Typography variant="h6" gutterBottom style={{color: "blue", marginBottom: -3}}>
                            filter posts by:
                        </Typography>
                        <ButtonGroup size='small'>
                            <Button variant={filterPosts==='timestamp'?'contained':'outlined'} onClick={()=>setFilterPosts('timestamp')}>Newest</Button>
                            <Button variant={filterPosts==='likes'?'contained':'outlined'} onClick={()=>setFilterPosts('likes')}>likes</Button>
                            <Button variant={filterPosts==='repliesCount'?'contained':'outlined'} onClick={()=>setFilterPosts('repliesCount')}>views</Button>
                        </ButtonGroup>
                    </Item>
                </Grid>

                {lastCompilationPlayedId&&
                    <div style={{marginTop: 10}}>
                        <Button size='small' variant='contained' onClick={()=>{
                            scrollToBottom()
                        }}>
                            last video played
                        </Button>
                    </div>
                }

                <Grid item sm={4} lg={12} xs={11}>
                    <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                        {quinielasList}
                    </Grid>
                    <div ref={pk}></div>
                    <Waypoint onEnter={handleWaypointEnter} onLeave={handleWaypointLeave}/>
                </Grid>

                <Grid item sm={11} lg={7} xs={11} style={{marginBottom: 20}}>
                    <Item elevation={4}>
                        <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/tz1Artboard+1.png" alt="logo" style={{width: 45, height: "auto"}}/>
                        <Typography style={{color: 'black', fontSize:'14px'}}>
                            Copyright © 2018-2023 Tiktokteenthots. All rights reserved.
                        </Typography>
                    </Item>
                </Grid>

            </Grid>
        );
    }else {
        return (
            <Spinner/>
        )
    }



}

export default TestingCompilations;