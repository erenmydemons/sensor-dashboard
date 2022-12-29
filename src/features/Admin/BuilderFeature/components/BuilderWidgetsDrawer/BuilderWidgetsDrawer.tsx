/* eslint-disable react-hooks/exhaustive-deps */
import { IconButton, Input, Option, Select, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import React, { FC, HTMLAttributes, useEffect, useMemo } from 'react';
import { IoIosClose } from 'react-icons/io';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/core/store';
import { useDistricts } from '../../hooks/useDistricts';
import { draggingWidgetToBuilder, dropWidgetToBuilder, selectBuilder, selectWidgets } from '../../reducers/builder.slice';
import { asyncGetCategories, selectCategories } from '../../reducers/category.slice';

export interface BuilderWidgetsDrawerProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const BuilderWidgetsDrawer: FC<BuilderWidgetsDrawerProps> = ({ onClose, ...props }) => {
  const widgets = useSelector(selectWidgets);
  const selectedBuilder = useSelector(selectBuilder);
  const _selectCategories = useSelector(selectCategories);
  const dispatch = useDispatch<AppDispatch>();
  const { register, control: formControl } = useForm();
  const { statesOrFederals } = useDistricts();

  const watchingKeyword = useWatch({ control: formControl, name: 'keyword' }) as string;
  const watchingState = useWatch({ control: formControl, name: 'state' }) as string;

  // When depend changed many times, should to cache it by useMemo
  const layoutFilteredWidgets = useMemo(
    () =>
      widgets.filter((currentWidget) => {
        const hasWidgetInBuilder = (selectedBuilder.data ?? []).find((builderWidget) => builderWidget.id === currentWidget.id);
        const matchedKeyword = watchingKeyword ? currentWidget.name.toLowerCase().includes(watchingKeyword.trim().toLowerCase()) : true;
        const matchedState = watchingState && watchingState !== 'all' ? currentWidget.states.includes(watchingState.toLowerCase()) : true;

        return !hasWidgetInBuilder && matchedKeyword && matchedState;
      }),
    [watchingKeyword, watchingState, widgets]
  );

  const onDragTransferWidgetToBuilder = (event: React.DragEvent<HTMLDivElement>, id: string) => {
    setTimeout(() => {
      event.dataTransfer.setData('text/plain', '');
      dispatch(draggingWidgetToBuilder(id));
      onClose && onClose();
    }, 0);
  };

  useEffect(() => {
    dispatch(dropWidgetToBuilder());
    dispatch(asyncGetCategories());
  }, []);

  return (
    <>
      <div
        {...props}
        style={{ boxShadow: '10px 10px 0 10000px rgba(0, 0, 0, 0.4)' }}
        className="fixed top-0 right-0 max-h-screen h-full bg-white w-[550px] shadow-md border-l border-l-gray-50 p-4 transition-all duration-200 "
      >
        <h2 className="font-bold text-lg flex items-center justify-between text-blue-500 mb-4">
          <span>Widgets</span>
          <IconButton onClick={onClose} variant="text">
            <IoIosClose size={32} />
          </IconButton>
        </h2>

        <div className="flex gap-4">
          <div className="w-6/12">
            <Input {...register('keyword')} className="w-full" label="Keyword" />
          </div>
          <div className="w-6/12">
            <Controller
              {...register('state')}
              control={formControl}
              render={(stateProps) => (
                <Select label="State" placeholder="Search" onChange={(value) => stateProps.field.onChange(value)}>
                  {statesOrFederals?.map((item) => (
                    <Option value={item.state.toLowerCase()}>{item.state}</Option>
                  ))}
                </Select>
              )}
            ></Controller>
          </div>
        </div>

        <div className="mt-4"></div>

        <Tabs value="input">
          <TabsHeader>
            {_selectCategories.map((category) => {
              return (
                <Tab key={category.id} value={category.id}>
                  {category.name}
                </Tab>
              );
            })}
          </TabsHeader>

          <TabsBody
            animate={{
              mount: { opacity: 1 },
              unmount: { opacity: 0 },
            }}
          >
            {_selectCategories.map((category) => {
              return (
                <TabPanel key={category.id} value={category.id} className="h-[90vh]">
                  {layoutFilteredWidgets.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-4 overflow-y-auto">
                      {(layoutFilteredWidgets ?? [])
                        .filter((widget) => widget.categories.includes(category.id))
                        .map((widget, i) => (
                          <div
                            className="relative flex items-center justify-center w-full h-[100px] bg-gray-100 rounded cursor-pointer text-sm"
                            onDragStart={(e) => onDragTransferWidgetToBuilder(e, widget.id)}
                            unselectable="on"
                            draggable
                          >
                            {/* {widget.name} */}
                            <img src={widget.thumbnail} alt={widget.name} className="w-full h-full rounded-md object-center object-cover" />

                            <div className="absolute top-0 left-0 w-full h-full font-bold bg-gray-900/50 flex items-center justify-center text-white">
                              {widget.name}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center w-full">
                      <span className="text-md">No widget here.</span>
                    </p>
                  )}
                </TabPanel>
              );
            })}
          </TabsBody>
        </Tabs>
      </div>
    </>
  );
};

export default BuilderWidgetsDrawer;
