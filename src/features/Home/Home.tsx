import { Button } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BuilderGrid from 'src/components/BuilderGrid/BuilderGrid';
import WidgetLoader from 'src/components/Widget/WidgetLoader';
import { Builder } from 'src/lib/@types/model';
import { ROUTER_PATHS } from 'src/lib/constants/general';
import database from 'src/mocks/database';

type Props = {};

const Home = (props: Props) => {
  const navigate = useNavigate();
  const [builder, setBuilder] = useState<Builder | null>(null);

  useEffect(() => {
    setBuilder(database().builder().getBuilder());
  }, []);

  return (
    <>
      <BuilderGrid className="bg-[#202124] min-h-screen max-h-screen">
        {builder?.data.map((widget) => (
          <div className="bg-black flex" key={widget.id} data-grid={{ ...widget.properties, static: true }}>
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
