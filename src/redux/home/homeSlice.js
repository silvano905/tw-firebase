import { createSlice } from '@reduxjs/toolkit';

export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        single: null,
        compilations: null
    },
    reducers: {
        getSingle: (state, action) => {
            state.single = action.payload
        },
        getCompilations: (state, action) => {
            state.compilations = action.payload
        }

    },
});

export const { getCompilations, getSingle } = homeSlice.actions;

export const selectSingle = (state) => state.home.single?state.home.single:null;
export const selectCompilations = (state) => state.home.compilations?state.home.compilations:null;


export default homeSlice.reducer;