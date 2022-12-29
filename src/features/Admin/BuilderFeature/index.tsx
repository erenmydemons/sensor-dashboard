/* eslint-disable react-hooks/exhaustive-deps */
import { Button, IconButton, Tooltip } from '@material-tailwind/react';
import { FC, useEffect, useRef, useState } from 'react';
import { IoIosBrowsers, IoIosClose, IoIosQrScanner, IoMdConstruct, IoMdExpand } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import BuilderGrid from 'src/components/BuilderGrid/BuilderGrid';
import Spinner from 'src/components/Spinner/Spinner';
import WidgetLoader from 'src/components/Widget/WidgetLoader';
import BuilderWidgetsDrawer from './components/BuilderWidgetsDrawer/BuilderWidgetsDrawer';
import {
  addWidgetToBuilder,
  asyncFetchAllWidgets,
  asyncFetchBuilder,
  asyncFetchWidgets,
  asyncSaveBuilderChanges,
  changeWidgetInBuilder,
  loadPattern,
  removeWidgetFromBuilder,
  resetBuilderAndWidget,
  selectBuilder,
  selectSaveLoading,
  selectWidgetIdDragging,
} from './reducers/builder.slice';

import { Layout } from 'react-grid-layout';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from 'src/core/store';
import { Builder } from 'src/lib/@types/model';
import { ROUTER_PATHS } from 'src/lib/constants/general';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export interface BuilderPageProps {}

const BuilderPage: FC<BuilderPageProps> = ({ ...props }) => {
  const refBuilder = useRef<HTMLDivElement | null>(null);
  const [isOpenDrawerWidget, setIsOpenDrawerWidget] = useState(false);
  const _selectBuilder = useSelector(selectBuilder);
  const selectDraggingWidgetId = useSelector(selectWidgetIdDragging);
  const selectedSaveBuilderLoading = useSelector(selectSaveLoading);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onToggleDrawerWidget = () => setIsOpenDrawerWidget((isOpen) => !isOpen);

  const onChangeLayout = (layout: Layout[]) => dispatch(changeWidgetInBuilder(layout));

  const onFullScreenBuilderSection = () => {
    const builderEl = refBuilder.current as HTMLDivElement;

    builderEl.requestFullscreen({});
  };

  const onDropWidgetToBuilder = (layout: Layout[], layoutItem: Layout, _event: Event) => {
    dispatch(addWidgetToBuilder({ widgetId: selectDraggingWidgetId as string, widgetLayout: layoutItem }));
  };

  const onRemoveWidgetFromBuilder = (widgetId: string) => {
    dispatch(removeWidgetFromBuilder(widgetId));
  };

  const onResetBuilder = () => {
    dispatch(resetBuilderAndWidget());
  };

  const onSaveBuilder = () => dispatch(asyncSaveBuilderChanges(_selectBuilder as Builder));

  const onLoadPattern = () => dispatch(loadPattern());

  useEffect(() => {
    dispatch(asyncFetchBuilder());
    dispatch(asyncFetchAllWidgets());
    dispatch(asyncFetchWidgets());
  }, []);

  const renderGridBuilderWidgets = (_selectBuilder.data ?? []).map((widget) => {
    return (
      <div className="flex rounded bg-black group" key={widget.id}>
        <WidgetLoader
          name={widget.name}
          description={widget?.description}
          setting={widget?.setting ?? {}}
          widget={widget.widget.name as any}
        />

        <IoIosClose
          title="Remove widget"
          size={32}
          className="cursor-pointer text-gray-600 absolute right-0 top-0 opacity-0 group-hover:opacity-100 z-50"
          onClick={() => onRemoveWidgetFromBuilder(widget.id)}
        />
      </div>
    );
  });

  return (
    <>
      <section>
        <div ref={refBuilder}>
          <BuilderGrid
            className="min-h-screen bg-[#202124]"
            onLayoutChange={onChangeLayout}
            onDrop={onDropWidgetToBuilder}
            layout={_selectBuilder.data?.map((widget) => ({ ...widget.properties, i: widget.id } as Layout))}
            autoSize
            isDroppable
          >
            {renderGridBuilderWidgets}
          </BuilderGrid>
        </div>

        {!renderGridBuilderWidgets.length && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="block text-lg font-bold mb-4 text-white">Drop your widget here</span>
            <IoIosQrScanner size={32} className="mx-auto text-white" />
          </div>
        )}

        <div className="fixed bottom-4 right-4 space-x-2 flex items-center">
          <Tooltip placeholder="top" content="This action will load a preconfigured">
            <Button variant="filled" className="inline-flex items-center" onClick={onLoadPattern}>
              <IoMdConstruct className="mr-2" size={16} />
              Load Default Pattern
            </Button>
          </Tooltip>
          <Button variant="outlined" onClick={onResetBuilder}>
            Reset
          </Button>
          <Button color="white" onClick={() => navigate(ROUTER_PATHS.HOME)}>
            View
          </Button>
          <Button onClick={onSaveBuilder}>{selectedSaveBuilderLoading ? 'Saving' : 'Save'}</Button>

          <Tooltip content="Fullscreen" placement="left">
            <IconButton onClick={onFullScreenBuilderSection}>
              <IoMdExpand size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip content="Open widgets" placement="left">
            <IconButton onClick={onToggleDrawerWidget}>
              <IoIosBrowsers size={24} />
            </IconButton>
          </Tooltip>
        </div>
      </section>

      {selectedSaveBuilderLoading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}

      {isOpenDrawerWidget && <BuilderWidgetsDrawer onClose={onToggleDrawerWidget} />}
    </>
  );
};

export default BuilderPage;
