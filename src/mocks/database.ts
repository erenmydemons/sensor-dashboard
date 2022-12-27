import { Builder, Widget } from 'src/lib/@types/model';
import jsonBuilders from 'src/mocks/builder.json';
import jsonBuilderWidgets from 'src/mocks/widgets.json';

export default function database() {
  return {
    builder: () => {
      const key = 'database_builder';

      return {
        getBuilder(): Builder {
          // Get local storage database saved
          const localData = localStorage.getItem(key) as string;
          const parsedLocalStorageData = JSON.parse(localData);
          if (parsedLocalStorageData) {
            return parsedLocalStorageData;
          }

          // or return default data json
          database()
            .builder()
            .saveBuilder(jsonBuilders as any);
          return jsonBuilders as any;
        },

        saveBuilder(builder: Builder) {
          const builderWidgets = builder.data;

          const widgetLists = database().widgets().get();

          const newWidgetLists = widgetLists.map((widgetItem) => {
            const findWidgetUsing = builderWidgets.find((widget) => widget.id === widgetItem.id);

            if (findWidgetUsing) {
              const isExistedBuilderId = widgetItem.builders.find((id) => builder.id === id);

              if (!isExistedBuilderId) widgetItem.builders.push(builder.id);
            } else {
              widgetItem.builders = widgetItem.builders.filter((builderId) => builderId !== builder.id);
            }

            return widgetItem;
          });

          localStorage.setItem(key, JSON.stringify(builder));

          database().widgets().setAll(newWidgetLists);
        },

        addWidget(builder: Builder) {
          localStorage.setItem(key, JSON.stringify(builder));
        },

        reset() {
          localStorage.removeItem(key);
        },
      };
    },
    widgets: () => {
      const key = 'database_widgets';

      return {
        get(): Widget[] {
          // const localData = localStorage.getItem(key) as string;

          // if (!localData) {
            localStorage.setItem(key, JSON.stringify(jsonBuilderWidgets));
          // }

          // return JSON.parse(localData) ?? jsonBuilderWidgets;
          return jsonBuilderWidgets as any;
        },

        setAll(widgets: Widget[]) {
          localStorage.setItem(key, JSON.stringify(widgets));
        },

        reset() {
          localStorage.removeItem(key);
        },
      };
    },
  };
}
