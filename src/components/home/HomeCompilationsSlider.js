import React, { Fragment, useState, useEffect } from 'react';

import Spinner from "../spinner/Spinner";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VideoComp from "../video/VideoComp";
import {Waypoint} from "react-waypoint";
import {styled} from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: theme.palette.text.secondary,
    marginBottom: 2,
    background: 'linear-gradient(45deg, #f8f9fa 30%, #e3e6ea 90%)'
}));
const HomeCompilationsSlider = ({posts, currentUser}) => {

    const [visible, setVisible] = useState(2)
    const showMoreItems = () =>{
        setVisible(prevState => prevState + 1)
    }

    if(posts.length>0) {

        let quinielasList;
        if(posts.length>0){
            quinielasList = posts.slice(0, 2).map(item => {
                return (
                    <>
                        <VideoComp post={item} currentUser={currentUser}/>
                        <Waypoint onEnter={showMoreItems}/>
                    </>
                )
            })
        }

        return (
            <Fragment>
                <Item elevation={2}>
                    <Typography variant="h6" gutterBottom style={{marginTop:-10, color: '#495057', fontFamily: "Playfair Display SC, serif"}}>
                        Teen thots from Tiktok, Intagram & Triller
                    </Typography>
                    <div style={{display: 'flex', alignItems: "center", justifyContent: "center", margin: '-10px 0 15px 0'}}>
                        <Avatar variant="square" alt="Remy Sharp" src={'https://chicagocarhelp.s3.us-east-2.amazonaws.com/igwhiteArtboard+1.png'}/>
                        <Avatar variant="square" alt="Remy Sharp" src={'https://chicagocarhelp.s3.us-east-2.amazonaws.com/tiktokwhiteArtboard+1.png'}/>
                        <Avatar variant="square" alt="Remy Sharp" src={'https://chicagocarhelp.s3.us-east-2.amazonaws.com/trillerwhiteArtboard+1.png'}/>
                    </div>

                    <List       sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 300,
                        '& ul': { padding: 0 },
                    }}>
                        <li>
                            {quinielasList}
                        </li>
                    </List>
                    <div style={{alignItems: "center", alignContent: "center", textAlign: "center", margin: '10px 0 10px 0'}}>
                        <Button endIcon={<PlayCircleIcon/>} variant="contained" href={'/tiktok-thots'}>
                            More teen thots videos
                        </Button>
                    </div>
                </Item>

            </Fragment>
        );

    }else {
        return (
            <Spinner/>

        )
    }

};


export default HomeCompilationsSlider;