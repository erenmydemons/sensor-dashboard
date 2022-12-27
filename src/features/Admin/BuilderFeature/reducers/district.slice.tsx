import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { DistrictState } from 'src/lib/@types/model';

export interface DistrictSliceState {
  all?: DistrictState[];
}

export const asyncFetchDistrictsAll = createAsyncThunk('district/getAll', async () => {
  return fetch('https://jianliew.me/malaysia-api/state/v1/all.json').then((res) => res.json());
});

const initialState: DistrictSliceState = {
  all: [],
};

const districtSlice = createSlice({
  initialState,
  name: 'districtSlice',
  reducers: {},
  extraReducers(builder) {
    builder.addCase(asyncFetchDistrictsAll.fulfilled, (state, action) => {
      state.all = [{ state: 'All' }, ...action.payload];
      return state;
    });
  },
});

export const selectAllDistricts = (state: RootState) => state.districts.all;

export default districtSlice.reducer;
