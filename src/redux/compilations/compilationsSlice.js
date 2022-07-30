import { createSlice } from '@reduxjs/toolkit';

export const compilationsSlice = createSlice({
    name: 'compilations',
    initialState: {
        compilations: null,
        compilation: null,
        unwatched: null,
        lastCompilationPlayedId: null
    },
    reducers: {
        getCompilations: (state, action) => {
            state.compilations = action.payload
        },
        getCompilation: (state, action) => {
            state.compilation = action.payload
        },
        nullUnwatchedCompilations: (state, action) => {
            state.unwatched = null
        },
        setLastCompilationPlayed: (state, action) => {
            state.lastCompilationPlayedId = action.payload
        },
        setUnwatchedCompilations: (state, action) => {
            state.unwatched = state.compilations.filter((item) => !item.data.watched.includes(action.payload))
        },
        removeUnwatchedCompilations: (state, action) => {
            state.unwatched = state.unwatched.filter((item) => !item.data.watched.includes(action.payload))
        },
        updateUnwatchedCompilations: (state, action) => {
            state.unwatched = state.unwatched.map((item) => item.id===action.payload.id?{ ...item, data: action.payload.data}:item)
        }

    },
});

export const { getCompilations, setUnwatchedCompilations, removeUnwatchedCompilations, nullUnwatchedCompilations, updateUnwatchedCompilations, setLastCompilationPlayed } = compilationsSlice.actions;

export const selectCompilations = (state) => state.compilations.compilations?state.compilations.compilations:null;
export const selectCompilation = (state) => state.compilations.compilation?state.compilations.compilation:null;
export const selectUnwatched = (state) => state.compilations.unwatched?state.compilations.unwatched:null;
export const selectLastCompilationPlayedId = (state) => state.compilations.lastCompilationPlayedId?state.compilations.lastCompilationPlayedId:null;

export default compilationsSlice.reducer;