import clsx from 'clsx';
import React, { FC, HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {}

const Spinner: FC<SpinnerProps> = (props) => {
  return (
    <div
      {...props}
      className={clsx('w-[30px] h-[30px] border-4 border-gray-300 border-l-blue-700 rounded-full animate-spin', props.className)}
    ></div>
  );
};

export default Spinner;
