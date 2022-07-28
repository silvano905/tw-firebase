import React, {useState, useEffect} from 'react';
import { Stream } from "@cloudflare/stream-react";
import { Link, useLocation } from "react-router-dom";
import VideoComp from "../components/video/VideoComp";
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where
} from "firebase/firestore";
import {Helmet} from "react-helmet";
import {getCompilations, selectUnwatched, selectCompilations} from "../redux/compilations/compilationsSlice";
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

    const [visible, setVisible] = useState(1)
    const showMoreItems = () =>{
        setVisible(prevState => prevState + 1)
    }
    let location = useLocation()

    const [filterPosts, setFilterPosts] = useState('timestamp')
    const [unwatched, setUnwatched] = useState(false)

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
        }

    }, [filterPosts,]);

    let quinielasList;
    if(allPosts&&allPosts.length>0){
        if(unwatched){
            quinielasList = allUnwatchedCompilations.slice(0, visible).map(item => {
                return (
                    <>
                        <VideoComp post={item} currentUser={currentUser} userData={userData}/>
                        <Waypoint onEnter={showMoreItems}/>
                    </>
                )
            })
        }else {
            quinielasList = allPosts.slice(0, visible).map(item => {
                return (
                    <>
                        <VideoComp post={item} currentUser={currentUser} userData={userData}/>
                        <Waypoint onEnter={showMoreItems}/>
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
                            <Button variant={unwatched?'contained':'outlined'} onClick={()=>setUnwatched(!unwatched)}>view only unwatched videos</Button>
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

export default VideoCompilations;