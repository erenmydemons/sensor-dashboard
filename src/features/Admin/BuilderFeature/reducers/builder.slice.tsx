import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layout } from 'react-grid-layout';
import { RootState } from '../../../../core/store';

import { Builder, Widget } from 'src/lib/@types/model';
import { routes } from 'src/mocks/server';

import builderPatternJson from 'src/mocks/builder-full.json';

export interface BuilderFilterState {
  widgetName: string;
  properties: {
    value: string;
    mappingTo: string;
  };
}

export interface BuilderFeatureState {
  widgets: Widget[];
  widgetsAll: Widget[];
  builder: Partial<Builder>;
  draggingWidgetId: string | null;

  isSaveLoading: boolean;

  filter: BuilderFilterState[];
}

const initialState: BuilderFeatureState = {
  builder: {},
  widgetsAll: [],
  widgets: [],
  draggingWidgetId: null,
  isSaveLoading: false,
  filter: [],
};

export const asyncFetchBuilder = createAsyncThunk('builder/fetchBuilder', async () => {
  return routes().builders.show();
});

export const asyncFetchWidgets = createAsyncThunk<Widget[]>('builder/fetchWidgetList', async () => {
  return routes().widgets.listWithoutBuilderUsed('builder-1') as any;
});

export const asyncFetchAllWidgets = createAsyncThunk<Widget[]>('builder/fetchAllWidgets', async () => {
  return routes().widgets.listAll() as any;
});

export const asyncSaveBuilderChanges = createAsyncThunk('builder/saveBuilder', async (builder: Builder) => {
  return routes().builders.save(builder);
});

const builderSlice = createSlice({
  name: 'builderSlice',
  initialState: initialState,
  reducers: {
    addWidgetToBuilder(state, action: PayloadAction<{ widgetId: string; widgetLayout: Layout }>) {
      const { widgetId, widgetLayout } = action.payload;

      let widget = state.widgets.find((_widget) => _widget.id === widgetId) as Widget;
      if (widgetLayout) {
        widget = {
          ...widget,
          properties: {
            ...widget.properties,
            x: widgetLayout.x,
            y: widgetLayout.y,
          },
        };

        state = {
          ...state,
          builder: { ...state.builder, data: (state.builder.data ?? []).concat(widget) },
          widgets: state.widgets.filter((widget) => widget.id !== widgetId),
        };
      }
      return state;
    },

    draggingWidgetToBuilder(state, action: PayloadAction<string>) {
      state.draggingWidgetId = action.payload;
      return state;
    },

    removeWidgetFromBuilder(state, action: PayloadAction<string>) {
      const widgetId = action.payload;
      const removedWidgetInList = (state.builder.data ?? []).filter((widget) => widget.id !== widgetId);

      const movingWidgetInBuilderToWidgetDrawer = state.widgetsAll.map((widget) => {
        if (widget.id === widgetId) {
          const builderIds = widget.builders.filter((builderId) => builderId !== state.builder.id);
          return { ...widget, builders: builderIds ?? [] };
        }

        return widget;
      });

      state = {
        ...state,
        builder: {
          ...state.builder,
          data: removedWidgetInList,
        },
        widgets: movingWidgetInBuilderToWidgetDrawer,
      };

      return state;
    },

    dropWidgetToBuilder(state) {
      state.draggingWidgetId = null;
      return state;
    },

    changeWidgetInBuilder(state, action: PayloadAction<{ [x: string]: any }[]>) {
      if (state.builder.data) {
        const widgetChangeProperties = (state.builder?.data ?? []).map((widget) => {
          const layoutChangeOfWidget = action.payload.find((layout) => layout.i === widget.id);

          return {
            ...widget,
            properties: {
              ...layoutChangeOfWidget,
            },
          };
        });

        state = {
          ...state,
          builder: {
            ...state.builder,
            data: widgetChangeProperties as any,
          },
        };
      }
      return state;
    },

    resetBuilderAndWidget: (state) => {
      state = {
        ...state,
        builder: {
          ...state.builder,
          data: [],
        },

        widgets: state.widgetsAll,
      };

      return state;
    },

    loadPattern: (state) => {
      console.log('Load pattern');
      state = { ...state, builder: builderPatternJson as any };
      return state;
    },

    addFilter: (state, act) => {
      console.log('Add new filter to store builder');

      const payload = act.payload as BuilderFilterState;
      const indexOfFilterExisted = state.filter?.findIndex((filterItem) => filterItem.widgetName === payload.widgetName);

      if (indexOfFilterExisted !== -1) {
        let shadowFilterAfterChanged = [...state.filter];
        shadowFilterAfterChanged.splice(indexOfFilterExisted, 1, payload);

        state = {
          ...state,
          filter: shadowFilterAfterChanged,
        };
      } else {
        state = {
          ...state,
          filter: [...state.filter, payload],
        };
      }

      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncFetchBuilder.fulfilled, (state, action) => {
      state.builder = action.payload;
      console.log('Fetched builder');
      return state;
    });

    builder.addCase(asyncFetchWidgets.fulfilled, (state, action) => {
      state.widgets = action.payload;
      console.log('Fetched widgets');
      return state;
    });

    builder.addCase(asyncFetchAllWidgets.fulfilled, (state, action) => {
      state.widgetsAll = action.payload;
      console.log('Fetched all widgets');
    });

    builder.addCase(asyncSaveBuilderChanges.pending, (state, action) => {
      state.isSaveLoading = true;
    });

    builder.addCase(asyncSaveBuilderChanges.fulfilled, (state, action) => {
      state.isSaveLoading = false;
      console.log('Save builder was completed');
    });
  },
});

export const {
  addWidgetToBuilder,
  changeWidgetInBuilder,
  draggingWidgetToBuilder,
  dropWidgetToBuilder,
  removeWidgetFromBuilder,
  resetBuilderAndWidget,
  addFilter,
  loadPattern,
} = builderSlice.actions;

export const selectWidgets = (state: RootState) => state.builderFeature.widgets;
export const selectBuilder = (state: RootState) => state.builderFeature.builder;
export const selectSaveLoading = (state: RootState) => state.builderFeature.isSaveLoading;
export const selectWidgetIdDragging = (state: RootState) => state.builderFeature.draggingWidgetId;
export const selectBuilderFilter = (state: RootState) => state.builderFeature.filter;

export default builderSlice.reducer;
