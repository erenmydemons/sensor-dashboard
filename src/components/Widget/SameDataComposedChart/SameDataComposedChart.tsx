import { useEffect, useRef, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axios from 'axios';

export default function SameDataComposedChart() {
  const [data, setData] = useState([
    {
      name: 'Label',
      percent: 0,
    },
  ]);

  const labels = {
    percentNoWater: 'No Water',
    percentWaterQuality: 'Water Quality',
    percentWaterPressure: 'Water Pressure',
    percentBillingMeter: 'Billing Meter',
    percentPipeBreakage: 'Pipe Breakage',
    percentOthers: 'Others',
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post('http://64.227.152.71/api/ijms/customer/workjob/summary', {
          districtId: 'JB',
          dateRange: 'TODAY',
          dateStart: '2022-11-04',
          dateEnd: '2022-11-05',
        });

        setData([
          { name: labels.percentNoWater, percent: data.percentNoWater },
          { name: labels.percentWaterQuality, percent: data.percentWaterQuality },
          { name: labels.percentWaterPressure, percent: data.percentWaterPressure },
          { name: labels.percentBillingMeter, percent: data.percentBillingMeter },
          { name: labels.percentPipeBreakage, percent: data.percentPipeBreakage },
          { name: labels.percentOthers, percent: data.percentOthers },
        ]);
      } catch {
        console.log('ERROR');
      }
    })();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="percent" barSize={80} fill="#413ea0" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
