import dayjs from 'dayjs';
import _get from 'lodash/get';
import { useEffect, useRef, useState } from 'react';
import { Area, Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IBuilderConfig } from 'src/lib/@types/model';
import { routes } from 'src/mocks/server';

const lazyLineTypeChart = {
  Line: Line,
  Bar: Bar,
  Area: Area,
};

export default function Example({ ...props }: any) {
  const refTimer = useRef<any>(null);
  const [config, setConfig] = useState<IBuilderConfig | null>(null);
  const [data, setData] = useState<any[]>([]);

  // Get config widget
  useEffect(() => {
    const widgetConfig = routes().configs.findOneWithWidgetIdAndBuilderId('StackedAreaChart', 'builder-1');

    if (widgetConfig) {
      const ms = 1000;
      const url = widgetConfig.apiUrl;
      refTimer.current = setInterval(async () => {
        try {
          const res = await fetch(url).then((res) => res.json());

          if (res) {
            const fieldsAvailable = widgetConfig.fields.filter((field) => field.show);
            const dataFields: any = fieldsAvailable.reduce(
              (mapped, fieldConfig) => ({
                ...mapped,
                [fieldConfig.displayName]: _get(res, fieldConfig.accessProperty),
              }),
              {}
            );

            const dataLine = {
              ...dataFields,
              name: widgetConfig.dataName.replace('$time', dayjs().format('hh:mm:ss')),
            };

            if (data.length <= 10) {
              setData([...data, dataLine]);
            } else {
              setData([...data.slice(1, data.length), dataLine]);
            }
          }
        } catch {
          console.error('error');
        }
      }, ms);

      setConfig(widgetConfig);

      return () => {
        clearInterval(refTimer.current);
      };
    }
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data ?? []}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        {/* <CartesianGrid strokeDasharray="5 5" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {config?.fields.map((field) => {
          if (!field.show) return null;

          const LineType = (lazyLineTypeChart as any)[field.lineType];

          return <LineType type="monotone" dataKey={field.displayName} stroke={field.color} fill={field.color} />;
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
