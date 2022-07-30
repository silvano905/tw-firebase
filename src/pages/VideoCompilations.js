import React, {useState, useEffect, useRef} from 'react';
import { useLocation } from "react-router-dom";
import VideoComp from "../components/video/VideoComp";
import {
    collection,
    query, orderBy, getDocs, where
} from "firebase/firestore";
import {setAlert, removeAlert} from "../redux/alerts/alertsSlice";
import {Helmet} from "react-helmet";
import {getCompilations, selectUnwatched, selectCompilations, setUnwatchedCompilations, selectLastCompilationPlayedId} from "../redux/compilations/compilationsSlice";
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
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

function VideoCompilations() {
    const dispatch = useDispatch()
    const allPosts = useSelector(selectCompilations)
    const allUnwatchedCompilations = useSelector(selectUnwatched)
    const currentUser = useSelector(selectUser)
    const userData = useSelector(selectUserData)
    const lastCompilationPlayedId = useSelector(selectLastCompilationPlayedId)

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


    const [visible, setVisible] = useState(1)
    const showMoreItems = () =>{
        setVisible(prevState => prevState + 1)
    }
    let location = useLocation()

    const [filterPosts, setFilterPosts] = useState('timestamp')
    const [unwatched, setUnwatched] = useState(false)

    //to remember the position of the last video shown
    let elementPosition = 0
    if(allPosts&&allPosts.length>0&&scrollDown){
        elementPosition = allPosts.findIndex(object => {
            return object.id === lastCompilationPlayedId;
        });
        if(elementPosition>=visible){
            setVisible(prevState => prevState + elementPosition)
        }
    }
    //end

    useEffect(() => {
        ReactGA.initialize('G-PH7BM56H1X')
        ReactGA.send({ hitType: "pageview", page: location.pathname })
        if(!allPosts){
            let p = collection(db, 'posts')
            let order = query(p, orderBy(filterPosts, 'desc'), where("section", "==", 'compilations'))
            const querySnapshot = getDocs(order).then(x=>{
                dispatch(getCompilations(
                    x.docs.map(doc => ({data: doc.data(), id: doc.id}))
                ))
            })
            if(currentUser&&allPosts){
                dispatch(setUnwatchedCompilations(currentUser.uid))
            }
        }

    }, [filterPosts,]);


    const handleUnwatchedVideos = (e) =>{
        e.preventDefault()
        if(currentUser){
            dispatch(setUnwatchedCompilations(currentUser.uid))
            setUnwatched(!unwatched)
        }else {
            dispatch(setAlert({message: 'you need an account to use this feature', type: 'info'}))
            setTimeout(()=>{dispatch(removeAlert())}, 6000)
        }
    }

    let quinielasList;
    if(allPosts&&allPosts.length>0){
        if(unwatched&&allUnwatchedCompilations){
            quinielasList = allUnwatchedCompilations.slice(0, visible).map(item => {
                return (
                    <>
                        <VideoComp post={item} currentUser={currentUser} userData={userData}/>
                        <Waypoint onEnter={showMoreItems}/>
                    </>
                )
            })
        }else {
            quinielasList = allPosts.slice(0, lastCompilationPlayedId&&scrollDown?elementPosition:elementPosition+visible).map(item => {
                return (
                    <>
                        <VideoComp post={item} currentUser={currentUser} userData={userData}/>
                        <Waypoint onEnter={showMoreItems}/>
                        <div ref={pk}></div>
                    </>
                )
            })
        }
    }

    if(allPosts){
        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                <Helmet>
                    <title>Tiktok Thots - Triller Thots - Instagram Thots | Teen Tik Tok Thots Compilations.</title>
                    <meta
                        name="description"
                        content="Tiktok thots & Triller thots compilations 2021. Watch top teen thots videos for free."
                    />
                </Helmet>

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

                        <div style={{marginTop: 10}}>
                            <Button variant={unwatched?'contained':'outlined'} onClick={handleUnwatchedVideos}>view only unwatched videos</Button>
                        </div>

                        {lastCompilationPlayedId&&
                            <div style={{marginTop: 10}}>
                                <Button size='small' variant={unwatched?'contained':'outlined'} onClick={()=>{
                                    scrollToBottom()
                                    setScrollDown(true)
                                }}>
                                    last video played
                                </Button>
                            </div>
                        }

                    </Item>
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    {quinielasList}
                </Grid>

            </Grid>
        );
    }else {
        return (
            <Spinner/>
        )
    }



}

export default VideoCompilations;