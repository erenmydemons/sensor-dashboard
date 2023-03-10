import jsonConfigSchema from '../../mocks/config-schema.json';
import jsonCategoriesSchema from '../../mocks/categories-schema.json';

export interface Widget {
  id: string;
  name: string;
  description: string;
  widget: Widget;
  properties: Properties;
  setting: Setting;
  createdAt: string;
  updatedAt: string;
  builders: string[];
  states: string[];
  categories: {
    parent: string[];
    children: string[];
  };
  thumbnail: string;
  label?: string[];
}

export interface Properties {
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  maxH: number;
  static: boolean;
}

export interface Setting {
  className: string;
}

export interface Builder {
  id: string;
  name: string;
  createdAt: string;
  locale: string;
  data: Widget[];
}

// export interface BuilderData {
//   id: string;
//   name: string;
//   description: string;
//   widget: Widget;
//   properties: Properties;
//   setting: Setting;
//   createdAt: string;
//   updatedAt: string;
// }

export interface Setting {
  className: string;
}

export interface DistrictState {
  administrative_division: string;
  state: string;
  capital: string;
  royal_capital: string;
  population: number;
  total_area: number;
  licence_plate_prefix: string;
  phone_area_code: string;
  abbreviation: string;
  ISO: string;
  FIPS: string;
  HDI: number;
  region: string;
  head_of_state: string;
  head_of_goverment: string;
}

export type Category = typeof jsonCategoriesSchema;

export type IBuilderConfig = Omit<typeof jsonConfigSchema, 'id'> & Partial<Pick<typeof jsonConfigSchema, 'id'>>;
