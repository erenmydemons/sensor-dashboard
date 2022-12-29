import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/core/store';
import { Category } from 'src/lib/@types/model';
import { routes } from 'src/mocks/server';

export interface CategorySliceState {
  categoriesList: Category[];
}

const initialState: CategorySliceState = {
  categoriesList: [],
};

export const asyncGetCategories = createAsyncThunk('category/getCategories', () => {
  return routes().categories.listAll();
});

const categorySlice = createSlice({
  initialState,
  name: 'categorySlice',
  reducers: {},
  extraReducers(builder) {
    builder.addCase(asyncGetCategories.fulfilled, (state, act) => {
      const { payload } = act;
      state.categoriesList = payload as Category[];
      return state;
    });
  },
});

// export const {} = categorySlice.actions;

export const selectCategories = (state: RootState) => state.categories.categoriesList;

export default categorySlice.reducer;
