import { FC, lazy, memo, Suspense } from 'react';

const WaterTemperature = lazy(() => import('./WaterTemperature/WaterTemperature'));
const PieTemperature = lazy(() => import('./PieTemperature/PieTemperature'));
const PieWater = lazy(() => import('./PieWater/PieWater'));
const MixBarChart = lazy(() => import('./MixBarChart/MixBarChart'));
const StackedAreaChart = lazy(() => import('./StackedAreaChart/StackedAreaChart'));
const SpecifiedDomainRadarChart = lazy(() => import('./SpecifiedDomainRadarChart/SpecifiedDomainRadarChart'));
const CustomActiveShapePieChart = lazy(() => import('./CustomActiveShapePieChart/CustomActiveShapePieChart'));
const TinyBarChart = lazy(() => import('./TinyBarChart/TinyBarChart'));
const SameDataComposedChart = lazy(() => import('./SameDataComposedChart/SameDataComposedChart'));
const SimpleRadialBarChart = lazy(() => import('./SimpleRadialBarChart/SimpleRadialBarChart'));

export const WIDGETS = {
  PieTemperature,
  PieWater,
  WaterTemperature,
  MixBarChart,
  StackedAreaChart,
  SpecifiedDomainRadarChart,
  CustomActiveShapePieChart,
  TinyBarChart,
  SameDataComposedChart,
  SimpleRadialBarChart,
};

export interface WidgetLoaderPassProps {
  name?: string;
  description?: string;
  setting?: {
    className?: string;
  };
}

export interface WidgetLoaderProps {
  widget: keyof typeof WIDGETS;
  name?: string;
  description?: string;
  setting?: {
    className?: string;
  };
}

const WidgetLoader: FC<WidgetLoaderProps> = ({ widget, ...props }) => {
  const Component = WIDGETS[widget];

  const Fallback = memo(() => <div>Widget loading...</div>);
  return (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );
};

export default WidgetLoader;
