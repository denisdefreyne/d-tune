import * as React from "react";
import PlayingTrack from "../types/playing_track";
import { MiniTitle, StatusBox } from "./common";

interface ActivePlayerProps {
  onPlaybackEnded: (t: PlayingTrack) => void;
  playingTrack: PlayingTrack;
}

interface LoadedAudioElementProps {
  onPlaybackEnded: (t: PlayingTrack) => void;
  mediaURL: string;
  playingTrack: PlayingTrack;
}

const LoadedAudioElement = (props: LoadedAudioElementProps) => (
  <audio
    style={{ float: "right", width: "500px" }}
    controls
    autoPlay
    onEnded={() => props.onPlaybackEnded(props.playingTrack)}
    src={props.mediaURL}
  />
);

const LoadingAudioElement = () => (
  <span
    style={{ float: "right", width: "500px", textAlign: "right", padding: "10px" }}
  >…</span>
);

const ActivePlayer = (props: ActivePlayerProps) => (
  <div>
    {
      props.playingTrack.mediaURL
        ? <LoadedAudioElement
            onPlaybackEnded={props.onPlaybackEnded}
            mediaURL={props.playingTrack.mediaURL}
            playingTrack={props.playingTrack}
          />
        : <LoadingAudioElement />
    }
    <MiniTitle>Now playing</MiniTitle><br />
    {props.playingTrack.track.artist.name} – {props.playingTrack.track.name}
  </div>
);

const IdlePlayer = () => (
  <div>
    <MiniTitle>Now playing</MiniTitle><br />Nothing playing right now
  </div>
);

interface PlayerProps {
  onPlaybackEnded: (t: PlayingTrack) => void;
  playingTrack: PlayingTrack | null;
}

export const Player = (props: PlayerProps) => (
  <StatusBox>
    {
      props.playingTrack
        ? <ActivePlayer playingTrack={props.playingTrack} onPlaybackEnded={props.onPlaybackEnded} />
        : <IdlePlayer />
    }
  </StatusBox>
);
