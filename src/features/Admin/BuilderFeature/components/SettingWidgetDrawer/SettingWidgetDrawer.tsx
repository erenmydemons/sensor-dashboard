import { Alert, Button, Checkbox, Input } from '@material-tailwind/react';
import { FC, FormEvent, useEffect } from 'react';
import { FieldValues, UseFormReturn, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import HighlightLanguage from 'src/components/HighlightLanguage/HighlightLanguage';
import { IBuilderConfig } from 'src/lib/@types/model';
import { flattenObject } from 'src/lib/utils/object';
import { routes } from 'src/mocks/server';

import './setting-widget-drawer.scss';

export interface SettingWidgetDrawerProps {
  onClose: () => void;
  formContext: UseFormReturn<FieldValues, any>;
}

const SettingWidgetDrawer: FC<SettingWidgetDrawerProps> = ({ onClose, formContext, ...props }) => {
  const watchedApiResponse = useWatch({
    control: formContext.control,
    name: 'apiResponse',
  });
  const watchedApiDisplay = useWatch({
    control: formContext.control,
    name: 'apiDisplay',
  });
  const watchedApiUrl = useWatch({
    control: formContext.control,
    name: 'apiUrl',
  });
  // const watchFields = useWatch({
  //   control: formContext.control,
  //   name: 'fields',
  // });
  const watchWidgetId = useWatch({
    control: formContext.control,
    name: 'settingWidgetId',
  });
  const watchBuilderId = useWatch({
    control: formContext.control,
    name: 'settingBuilderId',
  });
  // const watchDataName = useWatch({
  //   control: formContext.control,
  //   name: 'dataName',
  // });

  const onTestApiAction = async () => {
    const apiUrl = formContext.getValues()?.apiUrl ?? '';

    if (!apiUrl) {
      toast('Cannot find your API URL', {
        type: 'error',
        position: 'bottom-right',
      });
      return;
    }

    const fetcherResult: any = await fetch(apiUrl).then((r) => r.json());

    formContext.setValue('apiResponse', fetcherResult);
    formContext.setValue(
      'apiDisplay',
      Object.entries(flattenObject(fetcherResult)).map(([key, value]) => ({
        show: false,
        displayName: '',
        accessProperty: key,
      }))
    );
  };

  const onSaveSetting = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const uiValues = formContext.getValues();
    const data: IBuilderConfig = {
      dataName: uiValues.dataName,
      builderId: uiValues.settingBuilderId,
      widgetId: uiValues.settingWidgetId,
      apiUrl: uiValues.apiUrl,
      fields: uiValues.fields ?? [],
    };

    console.log('data', data);

    try {
      routes().configs.save(data);

      toast('Save data successfully', {
        type: 'success',
        position: 'bottom-right',
      });
    } catch (e: any) {
      toast(`An error occurred: ${e.message}`, {
        type: 'error',
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    if (!watchedApiUrl) {
      formContext.setValue('apiResponse', null);
      formContext.setValue('apiDisplay', null);
    }
  }, [watchedApiUrl]);

  useEffect(() => {
    formContext.register('apiResponse');
    formContext.register('apiDisplay');

    return () => {
      formContext.unregister('apiUrl');
    };
  }, [formContext]);

  useEffect(() => {
    if (!watchWidgetId) return;
    const config = routes().configs.findOneWithWidgetIdAndBuilderId(watchWidgetId, watchBuilderId);

    if (config) {
      formContext.setValue('apiDisplay', config.fields);
      formContext.setValue('apiResponse', null);
      formContext.setValue('apiUrl', config.apiUrl);
      formContext.setValue('settingBuilderId', config.builderId);
      formContext.setValue('settingWidgetId', config.widgetId);
      formContext.setValue('dataName', config.dataName);
    } else {
      formContext.setValue('apiUrl', 'https://codestus.abc/api/mock-data-test');
    }
  }, [watchWidgetId]);

  return (
    <form onSubmit={onSaveSetting} className="setting-widget-drawer absolute top-0 right-0 w-[550px] h-screen overflow-y-auto bg-white p-4">
      <Alert
        className="mb-4"
        color="amber"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div className="text-sm">[Experimental] Do not cover all cases, only for testing.</div>
      </Alert>
      <h2 className="font-bold text-lg flex items-center justify-between text-blue-400 mb-4">
        <span>1. Setup API</span>
        <div>
          <Button color="blue" type="submit" className="mr-4">
            Save
          </Button>
          <Button onClick={onClose ?? null} variant="text">
            Close
          </Button>
        </div>
      </h2>

      <div className="flex gap-4 mb-4 mt-8">
        <Input label="API URL" {...formContext.register('apiUrl', { required: true })} />
        <Button onClick={onTestApiAction} className="w-[100px]" type="button">
          Test
        </Button>
      </div>

      <label className="text-gray-600">Example response</label>
      <HighlightLanguage code={JSON.stringify(watchedApiResponse, null, 4)} language="javascript" />

      <div>
        <span className="block text-lg text-blue-400 font-bold">2. Information</span>

        <div className="mb-6 mt-4">
          <Input type="text" className="w-full" label="Data name" {...formContext.register('dataName')} />
        </div>

        {watchedApiDisplay &&
          (watchedApiDisplay as any[]).map(({ show, displayName, accessProperty, color, lineType }: any, index) => (
            <div className="flex items-center gap-2 mb-4" id={accessProperty}>
              <Checkbox {...formContext.register(`fields.${index}.show`, { value: show })} />
              <div className="max-w-[50px] max-h-[50px] w-[150px] h-[150px] rounded-full overflow-hidden transform scale-75">
                <input
                  type="color"
                  className="mb-4 w-full h-full transform-gpu scale-[5] cursor-pointer"
                  {...formContext.register(`fields.${index}.color`, { value: color })}
                />
              </div>
              <div className="form-input">
                <Input
                  type="text"
                  label="Display name"
                  className="mb-4"
                  {...formContext.register(`fields.${index}.displayName`, { value: displayName })}
                />
              </div>
              <div className="form-input">
                <Input
                  type="text"
                  label="Data"
                  {...formContext.register(`fields.${index}.accessProperty`, { value: accessProperty })}
                  readOnly
                />
              </div>
              <div className="form-input select">
                <select className="form-input" {...formContext.register(`fields.${index}.lineType`, { value: lineType || 'Area' })}>
                  <option value="Area">Area</option>
                  <option value="Line">Line</option>
                  <option value="Bar">Bar</option>
                </select>
              </div>
            </div>
          ))}
      </div>
    </form>
  );
};

export default SettingWidgetDrawer;
