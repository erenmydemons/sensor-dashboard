import { Builder } from 'src/lib/@types/model';
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
  };
}
