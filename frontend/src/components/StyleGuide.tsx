import * as React from "react";
import * as styledComponents from "styled-components";

import Album from "../types/album";
import Artist, { SpecialID as SpecialArtistID } from "../types/artist";
import Label from "../types/label";
import PlayingTrack from "../types/playing_track";
import Track from "../types/track";
import { Grid } from "./common";
import { Player } from "./Player";

const label = {
  id: 1,
  name: "The Label",
  isSpecial: false,
};

const artist = {
  id: 1,
  name: "The Artist",
  isSpecial: false,
};

const album = {
  id: 1,
  name: "The Album",
  label_id: 1,
  artist_id: 1,

  artist,
  label,
};

const track = {
  id: 1,
  name: "The Track",
  recording_time: "2018",
  track_position: 1,
  disc_position: 1,
  album_id: 1,
  artist_id: 1,

  artist,
  album,
};

const playingTrackWithMedia = {
  track,
  mediaURL: "http://example.com/song.mp3",
};

const playingTrackWithoutMedia = {
  track,
};

const StyleGuide = (props: {}) => (
  <React.Fragment>
    <div style={{ margin: "40px" }}>
      <Player playingTrack={null} onPlaybackEnded={() => null} />
    </div>
    <div style={{ margin: "40px" }}>
      <Player playingTrack={playingTrackWithMedia} onPlaybackEnded={() => null} />
    </div>
    <div style={{ margin: "40px" }}>
      <Player playingTrack={playingTrackWithoutMedia} onPlaybackEnded={() => null} />
    </div>
  </React.Fragment>
);

export default StyleGuide;
