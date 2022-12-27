import { Button } from '@material-tailwind/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BuilderGrid from 'src/components/BuilderGrid/BuilderGrid';
import WidgetLoader from 'src/components/Widget/WidgetLoader';
import { Builder, Widget } from 'src/lib/@types/model';
import { ROUTER_PATHS } from 'src/lib/constants/general';
import database from 'src/mocks/database';
import { selectBuilderFilter } from '../Admin/BuilderFeature/reducers/builder.slice';

type Props = {};

const Home = (props: Props) => {
  const navigate = useNavigate();
  const filter = useSelector(selectBuilderFilter);
  const [builder, setBuilder] = useState<Builder | null>(null);

  useEffect(() => {
    setBuilder(database().builder().getBuilder());
  }, []);

  // Calculate widget should be render by filtering []
  const builderRendered: (Widget & { matched: boolean })[] =
    filter.length !== 0
      ? ((builder?.data ?? []).map((widgetItem) => {
          const filterResults: boolean[] = [];

          filter.forEach((filterItem) => {
            const { value, mappingTo } = filterItem.properties;

            // Take value of widget from key (mapping) of filter
            const valueMapped = (widgetItem as any)[mappingTo];

            // After mapping from key in filter
            // If it's array, to check includes (cause it only a demo, so just covert simple case for this)
            if (Array.isArray(valueMapped)) {
              const containValues = valueMapped.includes(value);
              const containValueForAlwaysShow = valueMapped.includes('all');
              const orValueEqualAlwaysShow = value === 'all';

              filterResults.push(containValues || containValueForAlwaysShow || orValueEqualAlwaysShow);
            } else {
              filterResults.push(valueMapped === value);
            }
          });

          // Check all results after filtered were truthy
          return { ...widgetItem, matched: filterResults.every((result) => result) };
        }) as any)
      : builder?.data.map((item) => ({ ...item, matched: true })) ?? [];

  return (
    <>
      <BuilderGrid className="bg-[#202124] min-h-screen max-h-screen">
        {builderRendered.map((widget) => (
          <div
            className={clsx('bg-black flex', !widget.matched ? 'opacity-10' : '')}
            key={widget.id}
            data-grid={{ ...widget.properties, static: true }}
          >
            <WidgetLoader widget={widget.widget.name as any} />
          </div>
        ))}
      </BuilderGrid>

      <div className="fixed bottom-6 right-6">
        <Button variant="filled" onClick={() => navigate(ROUTER_PATHS.BUILDER)}>
          Go builder
        </Button>
      </div>
    </>
  );
};

export default Home;
