import { configureStore } from '@reduxjs/toolkit';
import categorySlice from 'src/features/Admin/BuilderFeature/reducers/category.slice';

import districtSlice from 'src/features/Admin/BuilderFeature/reducers/district.slice';
import builderFeatureSlice from '../../features/Admin/BuilderFeature/reducers/builder.slice';

const store = configureStore({
  reducer: {
    builderFeature: builderFeatureSlice,
    districts: districtSlice,
    categories: categorySlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
