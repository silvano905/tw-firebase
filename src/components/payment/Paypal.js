import React, {Fragment, useEffect, useState, useRef} from 'react';
import {useNavigate} from "react-router-dom"
import { useSelector,useDispatch } from 'react-redux';
import {selectUser, getUserData} from "../../redux/user/userSlice";
import {updateDoc, doc} from "firebase/firestore";
import {db} from '../../config-firebase/firebase'
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {removeAlert, setAlert} from "../../redux/alerts/alertsSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: 60,
    paddingBottom: 8
}));

const Paypal = () => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const paypalRef = useRef();
    const navigate = useNavigate()
    //4032031573397410
    //07/2027
    //439
    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: 'quinielas',
                                amount: {
                                    currency_code: 'USD',
                                    value: 7,
                                },
                            },
                        ],
                        application_context: { shipping_preference: 'NO_SHIPPING'}
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    //after the payment was successful make user premium
                    updateDoc(doc(db, 'usersData', user.uid),{
                        premium: true
                    }).then(()=>{
                        dispatch(getUserData({premium: true}))
                    })

                    //TODO
                    //add alerts and redirects
                    dispatch(setAlert('Payment was successful', 'success'))
                    navigate('/')
                    setTimeout(()=>{dispatch(removeAlert())}, 6000)
                },
                onError: err => {
                    console.log(err.message)
                    setError(err);
                },
            })
            .render(paypalRef.current);
    }, []);


    if (user) {


        return (

            <Fragment>
                <div style={{flexFlow: 1}}>
                    <Grid container spacing={0}>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Grid item xs={12} sm={11} lg={5}>
                                <Item>
                                    <div>
                                        {error && <div>Uh oh, an error occurred! {error.message}</div>}
                                        <Typography variant="h6" component="h6">
                                            Pay securely with Paypal
                                        </Typography>
                                        <div ref={paypalRef} />
                                    </div>
                                </Item>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Fragment>

        );
    }else {
        return (
            <p>nothing</p>
        )
    }


}


export default Paypal;