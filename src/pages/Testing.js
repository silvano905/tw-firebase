import React, {useState, useEffect, useRef} from 'react';
import {useLocation} from "react-router-dom";
import VideoCompTesting from "../components/video/VideoCompTesting";
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
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc'
}));

const ItemTwo = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc',
    position: 'relative',
}));

function Testing() {
    const dispatch = useDispatch()
    const allPosts = useSelector(selectPosts)
    const currentUser = useSelector(selectUser)
    const userData = useSelector(selectUserData)
    const lastPostPlayedId = useSelector(selectLastPostPlayedId)


    const [visible, setVisible] = useState(1)

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


    const [imageLoaded, setImageLoaded] = useState(false);


    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    let location = useLocation()

    useEffect(() => {
        ReactGA.initialize('G-PH7BM56H1X')
        ReactGA.send({ hitType: "pageview", page: location.pathname })
        // if(!allPosts){
        let p = collection(db, 'posts')
        let order = query(p, orderBy(filterPosts, 'desc'), where("section", "==", 'single'))
        const querySnapshot = getDocs(order).then(x=>{
            dispatch(getPosts(
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
            return object.id === lastPostPlayedId;
        });
        // if(elementPosition>=visible){
        //     setVisible(prevState => prevState + elementPosition)
        // }
    }
    let quinielasList;
    if(allPosts&&allPosts.length>0) {
            quinielasList = allPosts.slice(0, lastPostPlayedId&&scrollDown?elementPosition+1:visible).map(item => {
                return (
                    <Grid item sm={6} lg={6} xs={12}>
                        <VideoCompTesting post={item} currentUser={currentUser} userData={userData}/>
                    </Grid>
                )
            })

    }

        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                <Grid item sm={11} lg={10} xs={11}>
                    <Item elevation={4}>
                        <Typography variant="h5" gutterBottom style={{
                            background: 'linear-gradient(to right, #ff0000, #ffff00)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: -3
                        }}>
                            Tiktok Thots
                        </Typography>
                        <Typography variant="h5" gutterBottom style={{
                            background: 'linear-gradient(to right, #9f86c0, #231942)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: -3
                        }}>
                            Triller Thots
                        </Typography>
                        <Typography variant="h5" gutterBottom style={{
                            background: 'linear-gradient(to right, #f72585, #231942)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: -3
                        }}>
                            Instagram Thots
                        </Typography>
                        <Typography variant="h6" gutterBottom style={{color: "blue", marginBottom: -3, marginTop: 7}}>
                            filter posts by:
                        </Typography>
                        <ButtonGroup size='small'>
                            <Button variant={filterPosts==='timestamp'?'contained':'outlined'} onClick={()=>setFilterPosts('timestamp')}>Newest</Button>
                            <Button variant={filterPosts==='likes'?'contained':'outlined'} onClick={()=>setFilterPosts('likes')}>likes</Button>
                            <Button variant={filterPosts==='repliesCount'?'contained':'outlined'} onClick={()=>setFilterPosts('repliesCount')}>views</Button>
                        </ButtonGroup>
                    </Item>
                </Grid>

                {lastPostPlayedId&&
                    <div style={{marginTop: 10}}>
                        <Button size='small' variant='contained' onClick={()=>{
                            scrollToBottom()
                        }}>
                            last video played
                        </Button>
                    </div>
                }

                <Grid item sm={11} lg={12} xs={11}>
                    <ItemTwo elevation={4}>
                        <Card sx={{ maxWidth: 450, margin: 'auto' }}>
                            <CardMedia
                                component="img"
                                image={"/gh.jpg"}
                                alt="tiktok thots"
                                onLoad={handleImageLoad}
                            />
                        </Card>
                        {imageLoaded && (
                            <>
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        style={{
                                            WebkitBackgroundClip: "text",
                                            marginBottom: -150,
                                            textAlign: "center",
                                            color: "black",
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                            padding: "2px 2px 25px 2px",
                                            borderRadius: 5,
                                        }}
                                    >
                                        scroll down for videos
                                    </Typography>
                                </div>

                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <KeyboardDoubleArrowDownIcon
                                        fontSize={"large"}
                                        color={"primary"}
                                        style={{
                                            background: "linear-gradient(to right, #023e8a, #03045e)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            marginBottom: -180,
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </ItemTwo>
                </Grid>

                <Grid item sm={11} lg={12} xs={11}>
                    {allPosts?
                        <>
                            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                                {quinielasList}
                            </Grid>
                            <div ref={pk}></div>
                            <Waypoint onEnter={handleWaypointEnter} onLeave={handleWaypointLeave}/>
                        </>
                        :
                        <Spinner/>
                    }

                </Grid>

                {/*<Grid item sm={11} lg={7} xs={11} style={{marginBottom: 20}}>*/}
                {/*    <Item elevation={4}>*/}
                {/*        <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/tz1Artboard+1.png" alt="logo" style={{width: 45, height: "auto"}}/>*/}
                {/*        <Typography style={{color: 'black', fontSize:'14px'}}>*/}
                {/*            Copyright © 2018-2023 Tiktokteenthots. All rights reserved.*/}
                {/*        </Typography>*/}
                {/*    </Item>*/}
                {/*</Grid>*/}

            </Grid>
        );



}

export default Testing;