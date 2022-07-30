import React, {useState, useEffect, useRef} from 'react';
import { Stream } from "@cloudflare/stream-react";
import {Link, useLocation} from "react-router-dom";
import VideoComp from "../components/video/VideoComp";
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
import Paper from "@mui/material/Paper";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReactGA from "react-ga4";
import {removeAlert, setAlert} from "../redux/alerts/alertsSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc'
}));

function Post() {
    const dispatch = useDispatch()
    const allPosts = useSelector(selectPosts)
    const allUnwatchedPosts = useSelector(selectUnwatched)
    const currentUser = useSelector(selectUser)
    const userData = useSelector(selectUserData)
    const lastPostPlayedId = useSelector(selectLastPostPlayedId)

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

    const [filterPosts, setFilterPosts] = useState('timestamp')
    const [unwatched, setUnwatched] = useState(false)

    const [visible, setVisible] = useState(1)

    let location = useLocation()

    useEffect(() => {
        ReactGA.initialize('G-PH7BM56H1X')
        ReactGA.send({ hitType: "pageview", page: location.pathname })
        if(!allPosts){
            let p = collection(db, 'posts')
            let order = query(p, orderBy(filterPosts, 'desc'), where("section", "==", 'single'))
            const querySnapshot = getDocs(order).then(x=>{
                dispatch(getPosts(
                    x.docs.map(doc => ({data: doc.data(), id: doc.id}))
                ))
            })

        }
    }, [filterPosts,])


    const handleUnwatchedVideos = (e) =>{
        e.preventDefault()
        if(currentUser){
            dispatch(setUnwatchedPosts(currentUser.uid))
            setUnwatched(!unwatched)
        }else {
            dispatch(setAlert({message: 'you need an account to use this feature', type: 'info'}))
            setTimeout(()=>{dispatch(removeAlert())}, 6000)
        }
    }

    //to remember the position of the last video shown
    let elementPosition = 0
    if(allPosts&&allPosts.length>0){
        elementPosition = allPosts.findIndex(object => {
            return object.id === lastPostPlayedId;
        });
        // if(elementPosition>=visible){
        //     setVisible(prevState => prevState + elementPosition)
        // }
    }
    //end

    let quinielasList;
    if(allPosts&&allPosts.length>0){
        if(unwatched&&allUnwatchedPosts){
            quinielasList = allUnwatchedPosts.slice(0, visible).map(item => {
                return (
                    <>
                        <VideoComp post={item} currentUser={currentUser} userData={userData}/>
                        <Waypoint onEnter={()=>setVisible(prevState => prevState + 1)}/>
                    </>
                )
            })
        }else {
            quinielasList = allPosts.slice(0, lastPostPlayedId&&scrollDown?elementPosition:elementPosition+visible).map(item => {
                return (
                    <>
                        <VideoComp post={item} currentUser={currentUser} userData={userData}/>
                        <Waypoint onEnter={()=>setVisible(prevState => prevState + 1)}/>
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
                    <title>Teen creepshots & teen twerk videos. Twerk teen videos compilations.</title>
                    <meta
                        name="description"
                        content="Teen twerk videos compilations. Free teen creepshots from around the internet."
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

                        <div style={{marginTop: 10}}>
                            <Button size='small' variant={unwatched?'contained':'outlined'} onClick={()=>{
                                scrollToBottom()
                            }}>
                                last video played
                            </Button>
                        </div>
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

export default Post;