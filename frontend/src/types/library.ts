import Album from "../types/album";
import Artist from "../types/artist";
import Label from "../types/label";
import Track from "../types/track";

export default interface Library {
  labels: Label[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
