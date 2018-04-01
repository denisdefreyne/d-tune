import Album from "../types/album";
import Artist from "../types/artist";
import Label from "../types/label";
import Library from "../types/Library";
import Track from "../types/track";

export interface TrackDetailsResponse {
  track: {
    media_url: string;
  };
}

export interface EverythingResponse {
  labels: Array<{
    id: number;
    name: string;
  }>;

  artists: Array<{
    id: number;
    name: string;
  }>;

  albums: Array<{
    id: number;
    name: string;
    label_id: number | null;
    artist_id: number;
  }>;

  tracks: Array<{
    id: number;
    name: string;
    recording_time: string | null;
    track_position: number;
    disc_position: number | null;
    album_id: number;
    artist_id: number;
  }>;
}

const buildLibrary = (everything: EverythingResponse): Library => {
  const labels: Label[] =
    everything.labels.map((l) => ({ ...l, isSpecial: false }));

  const artists: Artist[] =
    everything.artists;

  const albums: Album[] =
    everything.albums.map((a) => ({ ...a, artist: artists.find((art) => a.artist_id === art.id)!, label: labels.find((l) => a.label_id === l.id) || null}));

  // FIXME: remove !
  const tracks: Track[] =
    everything.tracks.map((t) => ({ ...t, disc_position: t.disc_position || 1, artist: artists.find((a) => t.artist_id === a.id)!, album: albums.find((a) => t.album_id === a.id)! }));

  return {
    labels,
    artists,
    albums,
    tracks,
  };
};

const fetchEverything = (baseURL: string, onSuccess: (l: Library) => void, onFailure: (e: any) => void) => {
  fetch(baseURL + "/everything")
    .then((response) => response.json())
    .catch((error) => onFailure(error))
    .then((response) => onSuccess(buildLibrary(response)));
};

const fetchTrack = (trackID: number, baseURL: string, onSuccess: (r: TrackDetailsResponse) => void, onFailure: (e: any) => void) => {
  fetch(baseURL + "/tracks/" + trackID)
    .then((response) => response.json())
    .catch((error) => onFailure(error))
    .then((response) => onSuccess(response));
};

const API = {
  fetchEverything,
  fetchTrack,
};

export default API;
