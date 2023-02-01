import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import './styles.css';

const PieTemperature = () => {
  const [series, setSeries] = useState<Object>({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post('http://64.227.152.71/api/ijms/customer/workjob/summary', {
          districtId: 'JB',
          dateRange: 'TODAY',
          dateStart: '2022-11-04',
          dateEnd: '2022-11-05',
        });

        setSeries({
          percentNoWater: data.percentNoWater,
          percentWaterQuality: data.percentWaterQuality,
          percentWaterPressure: data.percentWaterPressure,
          percentBillingMeter: data.percentBillingMeter,
          percentPipeBreakage: data.percentPipeBreakage,
          percentOthers: data.percentOthers,
        });
      } catch {
        console.log('ERROR');
      }
    })();
  }, []);

  const labels = {
    percentNoWater: 'No Water',
    percentWaterQuality: 'Water Quality',
    percentWaterPressure: 'Water Pressure',
    percentBillingMeter: 'Billing Meter',
    percentPipeBreakage: 'Pipe Breakage',
    percentOthers: 'Others',
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={
          {
            chart: {
              width: 440,
              type: 'pie',
            },
            labels: Object.keys(series).map((k) => (labels as any)[k] as any),
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          } as any
        }
        series={Object.values(series as any) as any[]}
        type="pie"
        width={440}
      />
    </div>
  );
};

export default PieTemperature;
