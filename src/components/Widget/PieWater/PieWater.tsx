import clsx from 'clsx';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FC } from 'react';
import { WidgetLoaderPassProps } from '../WidgetLoader';

export interface ChartCircleExampleProps extends WidgetLoaderPassProps {}

const ChartCircleExample: FC<ChartCircleExampleProps> = ({ name, description, setting, ...props }) => {
  const [temperature, setTemperature] = useState(Math.round(Math.random() * 200));

  useEffect(() => {
    setInterval(() => {
      setTemperature(Math.round(Math.random() * 200));
    }, 2000);
  }, []);

  return (
    <div {...props} className={clsx(setting?.className, 'p-4 flex flex-col items-center justify-center bg-black rounded-md w-full')}>
      <div className="mt-2 text-center">
        <span className="text-5xl font-bold block text-white mb-2">{temperature}oC</span>
      </div>
      <h2 className="text-center font-bold text-white text-md">{name ?? 'Water Temperature'}</h2>
    </div>
  );
};

export default ChartCircleExample;
