import Track from "./track";

export default interface PlayingTrack {
  track: Track;
  mediaURL?: string | null;
}
