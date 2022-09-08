export interface Itinerary {
  groups: Group[];
}

export interface Track {
  name: string;
  url: string;
  color: string;
  id: string;
  length: number;
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
