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
import Box from '@mui/material/Box';
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
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import {getClip, getClips, selectClips} from "../redux/clips/clipsSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc'
}));

// function Clips() {
//     const dispatch = useDispatch()
//     const allPosts = useSelector(selectPosts)
//
//
//
//     let location = useLocation()
//
//     useEffect(() => {
//         ReactGA.initialize('G-PH7BM56H1X')
//         ReactGA.send({ hitType: "pageview", page: location.pathname })
//         // if(!allPosts){
//         let p = collection(db, 'clips')
//         let order = query(p, orderBy(filterPosts, 'desc'), where("section", "==", 'clips'))
//         const querySnapshot = getDocs(order).then(x=>{
//             dispatch(getPosts(
//                 x.docs.map(doc => ({data: doc.data(), id: doc.id}))
//             ))
//         })
//         // }
//     }, [filterPosts,])
//
//
//     let quinielasList;
//     if(allPosts&&allPosts.length>0) {
//         quinielasList = allPosts.slice(0, 10).map(item => {
//             return (
//                 <Grid item sm={4} lg={4} xs={12}>
//                     <Card sx={{ display: 'flex', margin: 5 }}>
//                         <CardMedia
//                             component="video"
//                             image={'https://d3sog3sqr61u3b.cloudfront.net/'+item.data.videoId}
//                             title="tiktok thots"
//                             controls
//                         />
//                     </Card>
//                 </Grid>
//             )
//         })
//
//     }
//
//     if(allPosts){
//         return (
//             <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
//
//                 <Grid item sm={4} lg={12} xs={11}>
//                     <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
//                         {quinielasList}
//                     </Grid>
//                 </Grid>
//
//
//             </Grid>
//         );
//     }else {
//         return (
//             <Spinner/>
//         )
//     }
//
//
//
// }
//
// export default Clips;


function Clips() {
    const dispatch = useDispatch();
    const allPosts = useSelector(selectClips);
    const [currentPost, setCurrentPost] = useState(0);

    let location = useLocation();

    useEffect(() => {
        ReactGA.initialize('G-PH7BM56H1X');
        ReactGA.send({ hitType: "pageview", page: location.pathname });

        let p = collection(db, 'clips');
        let order = query(p, orderBy('timestamp', 'desc'), where("section", "==", 'clips'));
        const querySnapshot = getDocs(order).then(x => {
            // Shuffle the documents
            const shuffledDocs = shuffle(x.docs);
            dispatch(getClips(
                shuffledDocs.map(doc => ({ data: doc.data(), id: doc.id }))
            ));
        });

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        //scroll automatically to the bottom
        // window.scrollTo(0, document.body.scrollHeight);
        document.getElementById('myElement').scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handlePreviousClick = () => {
        setCurrentPost((prev) => {
            const previousPost = prev - 1;
            if (previousPost < 0) {
                return allPosts.length - 1;
            } else {
                return previousPost;
            }
        });
    };

    const handleNextClick = () => {
        setCurrentPost((prev) => (prev + 1) % allPosts.length);
    };

    const post = allPosts && allPosts[currentPost];

    if (allPosts && post) {
        return (
            <>
                <Box sx={{ position: 'relative', height: '100vh' }}>
                    <Card sx={{ display: 'flex', margin: 0, position: 'absolute', top: 0, right: 0, bottom: 40, left: 0 }}>
                        <CardMedia
                            component="video"
                            image={'https://d3sog3sqr61u3b.cloudfront.net/' + post.data.videoId}
                            title="tiktok thots"
                            controls
                            autoPlay
                            controlsList="nodownload"
                            onEnded={handleNextClick}
                            sx={{ width: '100%', height: '100%' }}
                        />
                    </Card>
                    <Box sx={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', display: 'flex' }}>
                        <Button variant="contained" onClick={handlePreviousClick}>
                            Previous
                        </Button>
                        <Box sx={{ width: 2 }} />
                        <Button variant="contained" onClick={handleNextClick}>
                            Next
                        </Button>
                    </Box>
                </Box>
                <div id='myElement' style={{ height: '1px' }}></div>

            </>

        );
    } else {
        return (
            <Spinner />
        );
    }
}

export default Clips;