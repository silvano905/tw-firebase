import { createSlice } from '@reduxjs/toolkit';

export const picturesSlice = createSlice({
    name: 'pictures',
    initialState: {
        posts: null
    },
    reducers: {
        getPictures: (state, action) => {
            state.posts = action.payload
        },


    },
});

export const { getPictures } = picturesSlice.actions;

export const selectPictures = (state) => state.pictures.posts?state.pictures.posts:null;


export default picturesSlice.reducer;