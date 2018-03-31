import Album from "./album";
import Artist from "./artist";

export default interface Track {
  id: number;
  name: string;
  recording_time: string | null;
  track_position: number;
  disc_position: number;
  album_id: number;
  artist_id: number;

  artist: Artist;
  album: Album;
}
