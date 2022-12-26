/* eslint-disable react-hooks/exhaustive-deps */
import { IconButton, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import React, { FC, HTMLAttributes, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/core/store';
import { draggingWidgetToBuilder, dropWidgetToBuilder, selectBuilder, selectWidgets } from '../../builderSlice';

export interface BuilderWidgetsDrawerProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const BuilderWidgetsDrawer: FC<BuilderWidgetsDrawerProps> = ({ onClose, ...props }) => {
  const widgets = useSelector(selectWidgets);
  const selectedBuilder = useSelector(selectBuilder);
  const dispatch = useDispatch<AppDispatch>();

  const layoutFilteredWidgets = widgets.filter((currentWidget) => {
    const hasWidgetInBuilder = (selectedBuilder.data ?? []).find((builderWidget) => builderWidget.id === currentWidget.id);
    return !hasWidgetInBuilder;
  });

  const onDragTransferWidgetToBuilder = (event: React.DragEvent<HTMLDivElement>, id: string) => {
    setTimeout(() => {
      event.dataTransfer.setData('text/plain', '');
      dispatch(draggingWidgetToBuilder(id));
      onClose && onClose();
    }, 0);
  };

  useEffect(() => {
    dispatch(dropWidgetToBuilder());
  }, []);

  return (
    <>
      <div
        {...props}
        style={{ boxShadow: '10px 10px 0 10000px rgba(0, 0, 0, 0.4)' }}
        className="fixed top-0 right-0 max-h-screen h-full bg-white w-[400px] shadow-md border-l border-l-gray-50 p-4 transition-all duration-200 "
      >
        <h2 className="font-bold text-lg flex items-center justify-between text-blue-500 mb-4">
          <span>Widgets</span>
          <IconButton onClick={onClose} variant="text">
            <IoIosClose size={32} />
          </IconButton>
        </h2>

        <Tabs value="widget">
          <TabsHeader>
            <Tab key="widget" value="widget">
              Favorite widgets
            </Tab>
          </TabsHeader>

          <TabsBody
            animate={{
              mount: { opacity: 1 },
              unmount: { opacity: 0 },
            }}
          >
            <TabPanel key="widget" value="widget" className="h-[90vh]">
              {layoutFilteredWidgets.length ? (
                <div className="mt-4 grid grid-cols-2 gap-4 overflow-y-auto">
                  {(layoutFilteredWidgets ?? []).map((widget, i) => (
                    <div
                      className="flex items-center justify-center w-full h-[100px] bg-gray-100 rounded cursor-pointer text-sm"
                      onDragStart={(e) => onDragTransferWidgetToBuilder(e, widget.id)}
                      unselectable="on"
                      draggable
                    >
                      {widget.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center w-full">
                  <span className="text-md">End widget.</span>
                </p>
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </>
  );
};

export default BuilderWidgetsDrawer;
