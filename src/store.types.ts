export interface Itinerary {
  groups: Group[];
  name: string;
  types: { [key: string]: { color: string; symbol: string } };
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
}

export interface Group {
  name: string;
  tracks: Track[];
  id: string;
  visible: boolean;
  images: Image[];
}

export interface Image {
  url: string;
  location: [number, number];
}
