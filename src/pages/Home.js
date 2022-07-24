import React, {useState, useEffect} from 'react';
import { Stream } from "@cloudflare/stream-react";
import { Link } from "react-router-dom";
import HomePostSlider from "../components/home/HomePostSlider";
import HomeCompilationsSlider from "../components/home/HomeCompilationsSlider";
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where
} from "firebase/firestore";
import {Helmet} from "react-helmet";
import {getCompilations, getSingle, selectSingle, selectCompilations} from "../redux/home/homeSlice";
import { Waypoint } from 'react-waypoint';
import {db} from '../config-firebase/firebase'
import Spinner from "../components/spinner/Spinner";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
import {selectUser} from "../redux/user/userSlice";
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

function Home() {
    const dispatch = useDispatch()
    const allSingle = useSelector(selectSingle)
    const allCompilations = useSelector(selectCompilations)
    const [filterQuinielas, setFilterQuinielas] = useState('correct');
    const currentUser = useSelector(selectUser)


    const [visible, setVisible] = useState(2)
    const showMoreItems = () =>{
        setVisible(prevState => prevState + 1)
    }

    useEffect(() => {
        let p = collection(db, 'posts')
        let orderSingle = query(p, orderBy('timestamp', 'desc'), limit(4), where("section", "==", 'single'))
        const querySnapshotSingle = getDocs(orderSingle).then(x=>{
            dispatch(getSingle(
                x.docs.map(doc => ({data: doc.data(), id: doc.id}))
            ))
        })

        let orderCompilations = query(p, orderBy('timestamp', 'desc'), limit(4), where("section", "==", 'compilations'))
        const querySnapshotCompilations = getDocs(orderCompilations).then(x=>{
            dispatch(getCompilations(
                x.docs.map(doc => ({data: doc.data(), id: doc.id}))
            ))
        })

    }, []);


    if(allSingle&&allCompilations){
        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                <Helmet>
                    <title>Teen twerk videos compilations | Tiktokteenthots watch the best teen twerking videos</title>
                    <meta
                        name="description"
                        content="Teen twerking videos from Instagram and Youtube. Top teen twerk videos for free."
                    />
                </Helmet>

                <Grid item sm={11} lg={10} xs={11}>
                    <HomeCompilationsSlider posts={allCompilations} currentUser={currentUser}/>
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    <HomePostSlider posts={allSingle} currentUser={currentUser}/>
                </Grid>

                <Grid item sm={11} lg={7} xs={11} style={{marginBottom: 20}}>
                    <Item elevation={4}>
                        <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/tz1Artboard+1.png" alt="logo" style={{width: 45, height: "auto"}}/>
                        <Typography style={{color: 'black', fontSize:'14px'}}>
                            Copyright © 2018-2022 Tiktokteenthots. All rights reserved.
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

export default Home;