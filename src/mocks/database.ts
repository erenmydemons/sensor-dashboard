import { Builder, IBuilderConfig, Widget } from 'src/lib/@types/model';
import jsonBuilders from 'src/mocks/builder.json';
import jsonCategories from 'src/mocks/categories.json';
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

          return JSON.parse(localStorage.getItem(key) as string) ?? jsonBuilderWidgets;
        },

        setAll(widgets: Widget[]) {
          localStorage.setItem(key, JSON.stringify(widgets));
        },

        reset() {
          localStorage.removeItem(key);
        },
      };
    },
    category: () => {
      return {
        get(): typeof jsonCategories {
          return JSON.parse(JSON.stringify(jsonCategories));
        },
      };
    },
    config: () => {
      const key = 'database_builder_configs';

      return {
        get(): IBuilderConfig[] {
          return JSON.parse(localStorage.getItem(key) ?? '[]');
        },
        findOne(id: string): IBuilderConfig | null {
          const theConfigList = this.get();

          return theConfigList.find((config) => config.id === id) ?? null;
        },
        findOneWithWidgetIdAndBuilderId(widgetId: string, builderId: string) {
          const theConfigList = this.get();

          return theConfigList.find((config) => config.widgetId === widgetId && config.builderId === builderId) ?? null;
        },
        save(data: IBuilderConfig) {
          const availableData = this.get() ?? [];

          const genId = data.id ?? Math.random().toString() + new Date().getTime().toString();
          const configWidgetExisted = availableData.find(
            (item) => item.id === genId || (item.widgetId === data.widgetId && item.builderId === data.builderId)
          );

          if (configWidgetExisted) {
            // throw new Error('Cannot save the data was existed in the system');
            const result = availableData.filter((config) => config.id !== configWidgetExisted.id);

            data.id = configWidgetExisted.id;

            return localStorage.setItem(key, JSON.stringify([...result, data]));
          }

          return localStorage.setItem(key, JSON.stringify(availableData.concat({ ...data, id: genId })));
        },
        remove(id: string | string[]) {
          const availableData = this.get();
          let configsRemoved: IBuilderConfig[] = [];

          if (!Array.isArray(id)) {
            const config = availableData.find((config) => config.id === id);
            if (!config) throw new Error('Not found a config');

            configsRemoved = availableData.filter((config) => config.id !== id);
          } else if (Array.isArray(id)) {
            configsRemoved = availableData.filter((config) => id.includes(config?.id ?? ''));
          }

          return configsRemoved;
        },
      };
    },
  };
}
