import React, {useState, useEffect, useRef} from 'react';

import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
function Delete() {


        return (
            <>
                <Card sx={{ display: 'flex', margin: 5 }}>
                    <CardMedia
                        component="video"
                        image='https://d3sog3sqr61u3b.cloudfront.net/popita3.mp4'
                        title="Teen creepshots"
                        controls
                    />
                </Card>
                <Card sx={{ display: 'flex', margin: 5 }}>
                    <CardMedia
                        component="video"
                        image='https://d3sog3sqr61u3b.cloudfront.net/popita2.mp4'
                        title="Teen creepshots"
                        controls
                    />
                </Card>
            </>

        )



}

export default Delete;