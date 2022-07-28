import { createSlice } from '@reduxjs/toolkit';

export const compilationsSlice = createSlice({
    name: 'compilations',
    initialState: {
        compilations: null,
        compilation: null,
        unwatched: null
    },
    reducers: {
        getCompilations: (state, action) => {
            state.compilations = action.payload
            state.unwatched = state.compilations.filter((item) => !item.data.watched.includes(action.payload))
        },
        getCompilation: (state, action) => {
            state.compilation = action.payload
        },
        // setUnwatchedCompilations: (state, action) => {
        //     state.unwatched = state.compilations.filter((item) => !item.data.watched.includes(action.payload))
        // }

    },
});

export const { getCompilation, getCompilations } = compilationsSlice.actions;

export const selectCompilations = (state) => state.compilations.compilations?state.compilations.compilations:null;
export const selectCompilation = (state) => state.compilations.compilation?state.compilations.compilation:null;
export const selectUnwatched = (state) => state.compilations.unwatched?state.compilations.unwatched:null;

export default compilationsSlice.reducer;