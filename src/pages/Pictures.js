import React, {useState, useEffect} from 'react';

import Spinner from "../components/spinner/Spinner";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {db} from "../config-firebase/firebase";
import {getPictures, selectPictures} from "../redux/pictures/picturesSlice";
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
    const dispatch = useDispatch()
    const allPictures = useSelector(selectPictures)
    useEffect(() => {
        let p = collection(db, 'pictures')
        let orderSingle = query(p, orderBy('timestamp', 'desc'))
        const querySnapshotSingle = getDocs(orderSingle).then(x=>{
            dispatch(getPictures(
                x.docs.map(doc => ({data: doc.data(), id: doc.id}))
            ))
        })
    }, [])

    const [visible, setVisible] = useState(1)

    if(allPictures){
        let picturesList;
        picturesList = allPictures.slice(0, visible).map(item =>{
            return(
                <Item elevation={4}>
                    <Card sx={{ maxWidth: 350, margin: 'auto' }}>
                        <CardMedia
                            component="img"
                            image={"https://imagedelivery.net/k0yUaL8t05k_eXwwUxAOHw/"+item.data.url+'/public'}
                            alt="tiktok teen thots"
                        />
                    </Card>
                    <Waypoint onEnter={()=>setVisible(prevState => prevState + 1)}/>
                </Item>
            )
        })

        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                <Item elevation={4}>
                    <Typography variant="h6" gutterBottom style={{marginTop:-10, color: '#495057', fontFamily: "Playfair Display SC, serif"}}>
                        Teen thot pictures
                    </Typography>
                </Item>

                <Grid item sm={11} lg={10} xs={11}>
                    {picturesList}
                </Grid>


            </Grid>
        );

    }else {
        return (
            <Spinner/>
        )
    }


}

export default Pictures;