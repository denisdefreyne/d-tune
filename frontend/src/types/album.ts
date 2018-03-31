import Artist from "./artist";
import Label from "./label";

export default interface Album {
  id: number;
  name: string;
  label_id: number | null;
  artist_id: number;

  artist: Artist;
  label: Label | null;
}
