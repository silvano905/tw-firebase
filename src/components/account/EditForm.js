import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {auth, db} from '../../config-firebase/firebase'
import { updateProfile, updateEmail } from 'firebase/auth'
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {login} from "../../redux/user/userSlice";

//end material ui

const EditForm = ({id, name, email}) => {
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        show: false,
        showInfo: true,
        id:'',
        displayName: null,
        email: null
    });

    useEffect(() => {
        setFormData({...formData, displayName: name, email: email, id: id})

    }, []);



    const payReady = (e) => {
        e.preventDefault();
        if(name!==formData.displayName||email!==formData.email){
            updateEmail(auth.currentUser, formData.email).then()
            updateProfile(auth.currentUser, {
                displayName: formData.displayName
            }).then()
            dispatch(login({
                email: formData.email,
                uid: auth.currentUser.uid,
                displayName: formData.displayName,
            }))
        }

        // dispatch(editUser(id, formData));
        // history.push('/')
    };

    return (
        <Fragment>

                <form onSubmit={payReady}>
                    <FormControl style={{marginBottom: 8}}>
                        <TextField
                            label="Username"
                            name='displayName'
                            value={formData.displayName}
                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            fullWidth
                        />
                    </FormControl>

                    <FormControl style={{marginBottom: 8}}>
                        <TextField
                            label="Email"
                            name='Email'
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            fullWidth
                        />
                    </FormControl>

                    <div>
                        <Button style={{margin: '20px 0 10px'}} type='submit' variant="contained" color="primary">
                            confirm
                        </Button>
                    </div>
                </form>

        </Fragment>
    );

};

export default EditForm;