import clsx from 'clsx';
import { FC } from 'react';
import RGL, { ReactGridLayoutProps, WidthProvider } from 'react-grid-layout';
import { useWindowSize } from 'react-use';

export interface BuilderGridProps extends ReactGridLayoutProps {}

export type BuilderGridResizeHandle = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

const ReactGridLayout = WidthProvider(RGL);

const BuilderGrid: FC<BuilderGridProps> = ({ children, className, ...props }) => {
  const { height, width } = useWindowSize();

  console.log(height);

  return (
    <ReactGridLayout
      {...props}
      className={clsx('grid-layout', className)}
      width={props.width ?? width}
      rowHeight={height / 24}
      cols={24}
      autoSize
      isResizable
    >
      {children}
    </ReactGridLayout>
  );
};

export default BuilderGrid;
