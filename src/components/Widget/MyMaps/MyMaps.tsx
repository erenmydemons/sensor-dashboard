import { memo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const MapChart = () => {
  return (
    <ComposableMap>
      <Geographies geography="/maps.json">
        {({ geographies }) => {
          return geographies.map((geo) => {
            // const malaysia = geographies.find((geo) => geo.properties.name.toLowerCase() === 'malaysia');
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={
                  ['#ffedea', '#ffcec5', '#ffad9f', '#ff8a75', '#ff5533', '#e2492d', '#be3d26', '#9a311f', '#782618'][
                    Math.floor(Math.random() * 9)
                  ]
                }
              />
            );
          });
        }}
      </Geographies>
    </ComposableMap>
  );
};

export default memo(MapChart);
