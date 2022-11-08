import React, {useState, useEffect} from 'react';

import Spinner from "../components/spinner/Spinner";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {db} from "../config-firebase/firebase";
import {getTumblr, selectTumblr} from "../redux/tumblr/tumblrSlice";
import {useDispatch, useSelector} from "react-redux";
import {Waypoint} from "react-waypoint";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    marginBottom: 10,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

function Tumblr() {
    const dispatch = useDispatch()
    const allTumblr = useSelector(selectTumblr)
    useEffect(() => {
        let p = collection(db, 'tumblr')
        let orderSingle = query(p, orderBy('timestamp', 'desc'))
        const querySnapshotSingle = getDocs(orderSingle).then(x=>{
            dispatch(getTumblr(
                x.docs.map(doc => ({data: doc.data(), id: doc.id}))
            ))
        })
    }, [])


    const [visible, setVisible] = useState(1)

    if(allTumblr) {
        let tumblrList;
        tumblrList = allTumblr.slice(0, visible).map(item =>{
            return(
                <Item elevation={4}>
                    <Card sx={{ maxWidth: 350, margin: 'auto' }}>
                        <CardMedia
                            component="video"
                            image={item.data.url}
                            alt="tiktok teen thots"
                            controls
                            style={{height: '100%'}}

                        />
                    </Card>
                    {/*<iframe*/}
                    {/*    src={"https://embed.tumblr.com/embed/post/"+item.data.url}*/}
                    {/*    title="iframe Example 1"*/}
                    {/*    frameBorder='0'*/}
                    {/*    scrolling="auto"*/}
                    {/*    style={{display: "block", width: '100%', height: '64vh'}}*/}
                    {/*>*/}
                    {/*</iframe>*/}
                    <Waypoint onEnter={()=>setVisible(prevState => prevState + 1)}/>
                </Item>
            )
        })

        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                <Item elevation={4}>
                    <Typography variant="h6" gutterBottom style={{marginTop:-10, color: '#495057', fontFamily: "Playfair Display SC, serif"}}>
                        Candid teen thots found on Tumblr blogs
                    </Typography>

                    <Typography variant="h6" gutterBottom style={{marginTop:-10, color: '#1d6cc5', fontFamily: "Playfair Display SC, serif"}}>
                        All content from Tumblr
                    </Typography>
                </Item>

                <Grid item sm={11} lg={10} xs={11}>
                    {tumblrList}
                </Grid>


            </Grid>
        );
    }else {
        return (
            <Spinner/>
        )
    }



}

export default Tumblr;