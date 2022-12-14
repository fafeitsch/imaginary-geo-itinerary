export interface Itinerary {
  groups: Group[];
  name: string;
  types: { [key: string]: { color: string; symbol: string } };
  tiles: {
    server: string;
    attribution: string;
  };
  map: {
    lat: number;
    lng: number;
    zoom: number;
  };
  info: {
    label: string;
    link: string;
  };
}

export interface Track {
  name: string;
  url: string;
  id: string;
  length: number;
  color: string;
  symbol: string;
  type: string;
  info?: string;
}

export interface Group {
  name: string;
  tracks: Track[];
  id: string;
  selected: boolean;
  media: Medium[];
}

export interface Medium {
  url: string;
  location?: [number, number];
  alt?: '';
  type?: 'video' | 'image';
}
