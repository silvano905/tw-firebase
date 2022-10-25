import React, {useState, useEffect} from 'react';

import Spinner from "../components/spinner/Spinner";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
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

function Pictures() {
    useEffect(() => {

    }, [])

    return (
        <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

            <Item elevation={4}>
                <Typography variant="h6" gutterBottom style={{marginTop:-10, color: '#495057', fontFamily: "Playfair Display SC, serif"}}>
                    Teen thot pictures
                </Typography>
            </Item>

            <Grid item sm={11} lg={10} xs={11}>
                <Typography variant="h6" gutterBottom style={{marginTop:10, color: '#495057', textAlign: "center", fontFamily: "Playfair Display SC, serif"}}>
                    coming soon
                </Typography>
            </Grid>


        </Grid>
    );

}

export default Pictures;