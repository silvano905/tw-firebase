import React, {Fragment, useEffect, useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Paypal from "../components/payment/Paypal";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Divider from "@mui/material/Divider";
import {selectUser} from "../redux/user/userSlice";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: 10,
    background: '#fdfffc',
    margin: '15px auto 5px auto'
}));



const Cart = () => {
    const currentUser = useSelector(selectUser)

    //react hooks
    const dispatch = useDispatch()

    useEffect(() => {
    }, []);


    return (

        <Box sx={{ flexGrow: 1 }}>
            <Grid  container spacing={1} justifyContent="center">
                <Grid item sm={9} lg={10} xs={11}>
                    <Item elevation={6}>
                        <Typography variant="h5" gutterBottom style={{color: '#ffc300', fontFamily: 'Cinzel, serif'}}>
                            Premium
                        </Typography>
                        <div style={{margin: 10}}>
                            <Divider>
                                <ShoppingCartIcon/>
                            </Divider>
                        </div>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item sm={6} lg={6} xs={6}>
                                <Typography variant="h6" gutterBottom>
                                    Duration
                                </Typography>
                            </Grid>

                            <Grid item sm={6} lg={6} xs={6}>
                                <Typography variant="h6" gutterBottom>
                                    1 Year
                                </Typography>
                            </Grid>

                            <Grid item sm={6} lg={6} xs={6}>
                                <Typography variant="h6" gutterBottom>
                                    Total
                                </Typography>
                            </Grid>
                            <Grid item sm={6} lg={6} xs={6}>
                                <Typography variant="h6" gutterBottom>
                                    $14
                                </Typography>
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>

                <Grid item sm={9} lg={10} xs={11}>
                    <Paypal/>
                </Grid>
            </Grid>
        </Box>
    );






}

export default Cart;