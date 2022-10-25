import { createSlice } from '@reduxjs/toolkit';

export const tumblrSlice = createSlice({
    name: 'tumblr',
    initialState: {
        posts: null
    },
    reducers: {
        getTumblr: (state, action) => {
            state.posts = action.payload
        },


    },
});

export const { getTumblr } = tumblrSlice.actions;

export const selectTumblr = (state) => state.tumblr.posts?state.tumblr.posts:null;


export default tumblrSlice.reducer;