import React from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CollectionsIcon from '@mui/icons-material/Collections';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import {useSelector} from "react-redux";
import {selectUser} from "../redux/user/userSlice";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -8,
    left: 0,
    right: 0,
    margin: '0 auto',
    background: '#f8f9fa',
    color: 'blue'
});

function BottomNavbar() {

    return (
        <div>
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar style={{background: "ghostwhite"}}>
                    <IconButton color="inherit" aria-label="open drawer">
                        <Link to='/' style={{color: 'blue', textDecoration: 'none', marginLeft: 20}}>
                            <HomeIcon fontSize='large' style={{color: '#9bb6a6'}}/>
                        </Link>
                    </IconButton>
                    <IconButton color="inherit" aria-label="open drawer">
                        <Link to='/teen-thot-pictures' style={{color: 'blue', textDecoration: 'none', marginLeft: 20}}>
                            <CollectionsIcon fontSize='large' style={{color: '#9bb6a6'}}/>
                        </Link>
                    </IconButton>
                    <Link to='/tiktok-thots' style={{color: 'blue', textDecoration: 'none', marginLeft: 20}}>
                        <StyledFab aria-label="add">
                            <PlayArrowIcon fontSize='large' style={{ color: "orangered"}}/>
                        </StyledFab>
                    </Link>

                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit">
                        <Link to='/tumblr-thots' style={{color: 'blue', textDecoration: 'none', marginRight: 20}}>
                            <VideocamIcon fontSize='large' style={{color: '#9bb6a6'}}/>
                        </Link>
                    </IconButton>
                    <IconButton color="inherit">
                        <Link to='/account' style={{color: 'blue', textDecoration: 'none', marginRight: 20}}>
                            <AccountCircleIcon fontSize='large' style={{color: '#9bb6a6'}}/>
                        </Link>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar/>

        </div>
    );
}

export default BottomNavbar;