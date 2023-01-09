import { Builder, IBuilderConfig } from 'src/lib/@types/model';
import database from './database';

export function routes() {
  return {
    builders: {
      show: async () => {
        return database().builder().getBuilder();
      },
      save: async (builder: Builder) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            database().builder().saveBuilder(builder);
            return resolve(null);
          }, 1500);
        });
      },
    },
    widgets: {
      listAll: async () => {
        return database().widgets().get();
      },
      listWithoutBuilderUsed: async (builderId: string) => {
        return database()
          .widgets()
          .get()
          .filter((widget) => {
            return !widget.builders.includes(builderId as never);
          });
      },
      save: () => {},
    },
    categories: {
      listAll() {
        return database().category().get();
      },
    },

    configs: {
      listAll() {
        return database().config().get();
      },

      findOne(id: string) {
        return database().config().findOne(id);
      },

      findOneWithWidgetIdAndBuilderId(widgetId: string, builderId: string) {
        return database().config().findOneWithWidgetIdAndBuilderId(widgetId, builderId);
      },

      save(data: IBuilderConfig) {
        return database().config().save(data);
      },

      remove(id: string | string[]) {
        return database().config().remove(id);
      },
    },
  };
}
