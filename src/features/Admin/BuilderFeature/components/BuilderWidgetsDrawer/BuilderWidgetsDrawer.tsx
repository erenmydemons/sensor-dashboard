/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Chip, IconButton, Input, Option, Select, Tooltip } from '@material-tailwind/react';
import clsx from 'clsx';
import React, { FC, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { IoIosClose, IoMdArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/core/store';
import { WIDGET } from 'src/lib/constants/general';
import { useDistricts } from '../../hooks/useDistricts';
import { draggingWidgetToBuilder, dropWidgetToBuilder, selectBuilder, selectWidgets } from '../../reducers/builder.slice';
import { asyncGetCategories, selectCategories } from '../../reducers/category.slice';
import SettingWidgetDrawer from '../SettingWidgetDrawer/SettingWidgetDrawer';

export interface BuilderWidgetsDrawerProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const BuilderWidgetsDrawer: FC<BuilderWidgetsDrawerProps> = ({ onClose, ...props }) => {
  const widgets = useSelector(selectWidgets);
  const selectedBuilder = useSelector(selectBuilder);
  const _selectCategories = useSelector(selectCategories);
  const dispatch = useDispatch<AppDispatch>();
  const { register, control: formControl } = useForm();
  const formSetting = useForm();
  const { statesOrFederals } = useDistricts();

  const [currentSteps, setCurrentSteps] = useState({
    parent: -1,
    children: -1,
  });

  const [settingWidget, setSettingWidget] = useState({
    open: false,
    targetWidgetId: '',
  });

  const watchingKeyword = useWatch({ control: formControl, name: 'keyword' }) as string;
  const watchingState = useWatch({ control: formControl, name: 'state' }) as string;

  // When depend changed many times, should to cache it by useMemo
  const layoutFilteredWidgets = useMemo(
    () =>
      widgets
        .filter((currentWidget) => {
          const matchedKeyword = watchingKeyword ? currentWidget.name.toLowerCase().includes(watchingKeyword.trim().toLowerCase()) : true;
          const matchedState = watchingState && watchingState !== 'all' ? currentWidget.states.includes(watchingState.toLowerCase()) : true;

          return matchedKeyword && matchedState;
        })
        .map((_widget) => {
          const hasWidgetInBuilder = (selectedBuilder.data ?? []).find((builderWidget) => builderWidget.id === _widget.id);

          return { ..._widget, draggable: !hasWidgetInBuilder };
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

  const onToggleSettingWidgetDrawer = (widgetId: string) => {
    setSettingWidget((prevState) => ({
      ...prevState,
      open: !prevState.open,
      targetWidgetId: widgetId,
    }));

    formSetting.setValue('settingWidgetId', widgetId);
    formSetting.setValue('settingBuilderId', 'builder-1');
  };

  const onCloseSettingWidgetDrawer = () => {
    setSettingWidget({
      open: false,
      targetWidgetId: '',
    });
  };

  const onSetSteps = (type: keyof typeof currentSteps, index: number) => {
    setCurrentSteps((prevState) => {
      const additional = type === 'parent' ? { children: currentSteps.children === -1 ? 0 : 1 } : {};
      return {
        ...prevState,
        [type]: index,
        ...additional,
      };
    });
  };

  useEffect(() => {
    dispatch(dropWidgetToBuilder());
    dispatch(asyncGetCategories());
  }, []);

  useEffect(() => {
    formSetting.register('settingWidgetId');
    formSetting.register('settingBuilderId');
  }, [formSetting]);

  console.log('layoutFilteredWidgets', layoutFilteredWidgets);

  const category = _selectCategories?.[currentSteps.parent];
  const subCategory = category ? category.children[currentSteps.children] : null;

  return (
    <>
      <div
        {...props}
        style={{ boxShadow: '10px 10px 0 10000px rgba(0, 0, 0, 0.4)' }}
        className={clsx(
          'fixed top-0',
          {
            'right-0': !settingWidget.open,
            'right-[550px]': settingWidget.open,
          },
          'max-h-screen h-full w-[550px]',
          'shadow-md bg-white border-l border-l-gray-50 p-4',
          'transition-all duration-200'
        )}
      >
        <h2 className="font-bold text-lg flex items-center justify-between text-blue-500 mb-4">
          <span>Widgets</span>
          <IconButton onClick={onClose} variant="text">
            <IoIosClose size={32} />
          </IconButton>
        </h2>

        {currentSteps.parent !== -1 ? (
          <>
            <div
              color="white"
              className="my-4 inline-flex items-center cursor-pointer pr-4 py-2"
              onClick={() => {
                onSetSteps('parent', -1);
                onSetSteps('children', -1);
              }}
            >
              <IoMdArrowBack size={18} className="mr-2" />
              Back
            </div>

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
          </>
        ) : null}

        {currentSteps.parent === -1 ? (
          <div className="grid grid-cols-2 gap-4">
            {_selectCategories.map((category, index) => (
              <div
                className={clsx('min-h-[100px] text-white rounded-md shadow-md flex items-center justify-center cursor-pointer', [
                  currentSteps.parent === index ? 'bg-gray-700' : 'bg-blue-500',
                ])}
                key={`parent-${category.id}`}
                onClick={() => onSetSteps('parent', index)}
              >
                {category.name}
              </div>
            ))}
          </div>
        ) : null}

        {currentSteps.parent !== -1 && (
          <div className="flex gap-2 flex-wrap mt-5 mb-8">
            {_selectCategories[currentSteps.parent].children.map((subCategory, index) => {
              const isTargetSubCategory =
                _selectCategories?.[currentSteps.parent]?.children?.[currentSteps.children]?.id === subCategory.id;
              return (
                <div
                  className={clsx('px-4 py-2 rounded-2xl text-xs cursor-pointer', {
                    'bg-blue-500 text-white': isTargetSubCategory,
                    'border border-blue-500 text-blue-500': !isTargetSubCategory,
                  })}
                  key={subCategory.id}
                  onClick={() => onSetSteps('children', index)}
                >
                  {subCategory.name}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4 overflow-y-auto">
          {(layoutFilteredWidgets ?? [])
            .filter((widget) => {
              const isContainCategory = widget.categories.parent.includes(category?.id);
              const isContainSubCategory = widget.categories.children.includes(subCategory?.id ?? '');
              return isContainCategory && isContainSubCategory;
            })
            .map((widget, i) => {
              const isIntegratedAPILabel = widget.label?.includes(WIDGET.LABEL.INTEGRATE_API);
              return (
                <div
                  className={clsx(
                    'relative flex items-center justify-center w-full h-[100px] bg-gray-100 rounded cursor-pointer text-sm overflow-hidden',
                    {
                      grayscale: !widget.draggable,
                    }
                  )}
                  onDragStart={(e) => onDragTransferWidgetToBuilder(e, widget.id)}
                  unselectable="on"
                  draggable={widget.draggable}
                >
                  <img src={widget.thumbnail} alt={widget.name} className="w-full h-full rounded-md object-center object-cover" />

                  <div className="absolute top-0 left-0 w-full h-full font-bold bg-gray-900/50 flex items-center justify-center text-white">
                    {widget.name}
                  </div>

                  {isIntegratedAPILabel && (
                    <Tooltip content="Open settings">
                      <div className="absolute top-0 -right-3 scale-75" onClick={() => onToggleSettingWidgetDrawer(widget.id)}>
                        <Chip value="Configuration" />
                      </div>
                    </Tooltip>
                  )}
                </div>
              );
            })}
        </div>

        {/* <Tabs value="input">
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
                        .map((widget, i) => {
                          const isIntegratedAPILabel = widget.label?.includes(WIDGET.LABEL.INTEGRATE_API);
                          return (
                            <div
                              className={clsx(
                                'relative flex items-center justify-center w-full h-[100px] bg-gray-100 rounded cursor-pointer text-sm overflow-hidden',
                                {
                                  grayscale: !widget.draggable,
                                }
                              )}
                              onDragStart={(e) => onDragTransferWidgetToBuilder(e, widget.id)}
                              unselectable="on"
                              draggable={widget.draggable}
                            >
                              <img
                                src={widget.thumbnail}
                                alt={widget.name}
                                className="w-full h-full rounded-md object-center object-cover"
                              />

                              <div className="absolute top-0 left-0 w-full h-full font-bold bg-gray-900/50 flex items-center justify-center text-white">
                                {widget.name}
                              </div>

                              {isIntegratedAPILabel && (
                                <Tooltip content="Open settings">
                                  <div className="absolute top-0 -right-3 scale-75" onClick={() => onToggleSettingWidgetDrawer(widget.id)}>
                                    <Chip value="Configuration" />
                                  </div>
                                </Tooltip>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-center w-full">
                      <span className="text-md">No widget.</span>
                    </p>
                  )}
                </TabPanel>
              );
            })}
          </TabsBody>
        </Tabs> */}
      </div>

      {settingWidget.open && <SettingWidgetDrawer onClose={onCloseSettingWidgetDrawer} formContext={formSetting} />}
    </>
  );
};

export default BuilderWidgetsDrawer;
