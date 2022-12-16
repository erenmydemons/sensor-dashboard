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
}

export interface Widget {
  name: string;
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
  data: BuilderData[];
}

export interface BuilderData {
  id: string;
  name: string;
  description: string;
  widget: Widget;
  properties: Properties;
  setting: Setting;
  createdAt: string;
  updatedAt: string;
}

export interface Widget {
  name: string;
}

export interface Setting {
  className: string;
}
