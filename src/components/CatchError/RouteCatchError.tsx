import React from 'react';
import { useRouteError } from 'react-router-dom';

type Props = {};

const RouteCatchError = (props: Props) => {
  const error = useRouteError();

  console.log('error', error);

  return <div>RouteCatchError</div>;
};

export default RouteCatchError;
