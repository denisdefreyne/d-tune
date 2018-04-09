import * as React from "react";

import PlayingTrack from "../types/playing_track";
import { MiniTitle, StatusBox } from "./common";
import * as style from "./style.css";

interface ActivePlayerProps {
  onPlaybackEnded: (t: PlayingTrack) => void;
  playingTrack: PlayingTrack;
}

interface LoadedAudioElementProps {
  onPlaybackEnded: (t: PlayingTrack) => void;
  mediaURL: string;
  playingTrack: PlayingTrack;
}

enum PlayingState {
  Playing,
  Paused,
}

interface LoadedAudioElementState {
  elapsedTime: number;
  totalDuration: number;
  playingState: PlayingState;
}

class LoadedAudioElement extends React.Component<LoadedAudioElementProps, LoadedAudioElementState> {
  private audioRef: HTMLAudioElement | null;
  private setAudioRef: (elem: HTMLAudioElement) => void;

  constructor(props: LoadedAudioElementProps) {
    super(props);

    this.state = {
      elapsedTime: 0,
      totalDuration: 0,
      playingState: PlayingState.Paused,
    };

    this.audioRef = null;
    this.setAudioRef = (elem: HTMLAudioElement) => {
      this.audioRef = elem;
    };
  }

  public render() {
    return (
      <div className={style.player}>
        <button onClick={() => this.onClickPlay()} className={style.playerControls}>
          {this.state.playingState === PlayingState.Paused ? "▶" : "❚❚"}
        </button>
        <progress max={this.state.totalDuration} value={this.state.elapsedTime} className={style.playerProgress} />
        <audio
          autoPlay
          onTimeUpdate={() => this.onTimeUpdate()}
          onDurationChange={() => this.onDurationChange()}
          onPlaying={() => this.onPlaying()}
          onPause={() => this.onPause()}
          onEnded={() => this.props.onPlaybackEnded(this.props.playingTrack)}
          src={this.props.mediaURL}
          ref={this.setAudioRef}
        />
      </div>
    );
  }

  private onPlaying() {
    this.setState({
      playingState: PlayingState.Playing,
    });
  }

  private onPause() {
    this.setState({
      playingState: PlayingState.Paused,
    });
  }

  private onClickPlay() {
    if (this.audioRef) {
      if (this.state.playingState === PlayingState.Paused) {
        this.audioRef.play();
      } else {
        this.audioRef.pause();
      }
    }
  }

  private onDurationChange() {
    if (this.audioRef) {
      this.setState({
        totalDuration: this.audioRef.duration,
      });
    }
  }

  private onTimeUpdate() {
    if (this.audioRef) {
      this.setState({
        elapsedTime: this.audioRef.currentTime,
      });
    }
  }
}

const ActivePlayer = (props: ActivePlayerProps) => (
  <div>
    {
      props.playingTrack.mediaURL
        ? <LoadedAudioElement
            onPlaybackEnded={props.onPlaybackEnded}
            mediaURL={props.playingTrack.mediaURL}
            playingTrack={props.playingTrack}
          />
        : null
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
