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
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
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
    const allPosts = useSelector(selectPosts);
    const [currentPost, setCurrentPost] = useState(0);

    let location = useLocation();

    useEffect(() => {
        ReactGA.initialize('G-PH7BM56H1X');
        ReactGA.send({ hitType: "pageview", page: location.pathname });

        let p = collection(db, 'clips');
        let order = query(p, orderBy('timestamp', 'desc'), where("section", "==", 'clips'));
        const querySnapshot = getDocs(order).then(x => {
            dispatch(getPosts(
                x.docs.map(doc => ({ data: doc.data(), id: doc.id }))
            ));
        });
    }, []);

    useEffect(() => {
        const debounce = (fn, delay) => {
            let timer = null;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    fn(...args);
                }, delay);
            };
        };

        const handleScroll = debounce((event) => {
            const delta = Math.sign(event.deltaY);
            setCurrentPost((prev) => {
                const nextPost = prev + delta;
                if (nextPost < 0) {
                    return 0;
                } else if (nextPost >= allPosts.length) {
                    return allPosts.length - 1;
                } else {
                    return nextPost;
                }
            });
        }, 100);

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [allPosts.length]);

    const post = allPosts && allPosts[currentPost];

    if (allPosts && post) {
        return (
                <Card sx={{ display: 'flex', margin: 0, position: 'absolute', top: 0, right: 0, bottom: 60, left: 0 }}>
                    <CardMedia
                        component="video"
                        image={'https://d3sog3sqr61u3b.cloudfront.net/' + post.data.videoId}
                        title="tiktok thots"
                        controls
                        autoPlay
                        sx={{ width: '100%', height: '100%' }}
                        onEnded={() => setCurrentPost((prev) => (prev + 1) % allPosts.length)}
                    />
                </Card>
        );
    } else {
        return (
            <Spinner />
        );
    }
}

export default Clips;