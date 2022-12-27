/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/core/store';
import { asyncFetchDistrictsAll, selectAllDistricts } from '../reducers/district.slice';

export interface DistrictHookArgs {}

export function useDistricts(args?: DistrictHookArgs) {
  const dispatch = useDispatch<AppDispatch>();
  const statesOrFederals = useSelector(selectAllDistricts);

  useEffect(() => {
    if (!statesOrFederals?.length) {
      dispatch(asyncFetchDistrictsAll());
    }
  }, []);

  return { statesOrFederals: statesOrFederals };
}
