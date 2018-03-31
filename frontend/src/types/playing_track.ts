import Track from "./track";

export default interface PlayingTrack extends Track {
  mediaURL?: string | null;
}
