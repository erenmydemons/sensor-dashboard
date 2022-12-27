import { Option, Select } from '@material-tailwind/react';
import clsx from 'clsx';
import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDistricts } from 'src/features/Admin/BuilderFeature/hooks/useDistricts';
import { addFilter, BuilderFilterState } from 'src/features/Admin/BuilderFeature/reducers/builder.slice';

import './filter-state.scss';

export interface FilterStateProps extends HTMLAttributes<any> {}

const FilterState: FC<FilterStateProps> = (props) => {
  const refFilterState = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const { statesOrFederals } = useDistricts();

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (refFilterState.current) {
      refFilterState.current.parentElement?.classList.add('z-10');
    }
  }, [refFilterState]);

  useEffect(() => {
    if (value) {
      dispatch(addFilter({ widgetName: 'FilterState', properties: { mappingTo: 'states', value: value } } as BuilderFilterState));
    }
  }, [value, dispatch]);

  return (
    <div {...props} ref={refFilterState} className={clsx('filter-state', props.className)}>
      <Select className="w-full" label="State" onChange={(_value) => setValue(_value as string)}>
        {statesOrFederals?.map((item) => {
          const state = item.state.toLowerCase();
          return (
            <Option key={state} value={state}>
              {item.state}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default FilterState;
