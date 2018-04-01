import * as React from "react";
import * as styledComponents from "styled-components";

import Album from "../types/album";
import Artist from "../types/artist";
import Label from "../types/label";
import PlayingTrack from "../types/playing_track";
import Track from "../types/track";

const {
  default: styled,
  injectGlobal,
} = styledComponents;

injectGlobal`
  body {
    background: #fff;

    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    line-height: 20px;
  }

  table {
    border-collapse: collapse;
  }

  ul, ol {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  dl {
    margin: 0;
    padding: 0;
  }

  dt {
    text-transform: uppercase;

    font-weight: normal;
    font-size: 12px;

    margin: 10px 0 0 0;
  }

  dd {
    margin: 0;
  }
`;

const Page = styled.div`
`;

const H1 = styled.h1`
  margin: 0;

  font-style: italic;
  font-weight: 500;

  grid-column: 1 / -1;
`;

const Grid = styled.div`
  display: grid;

  position: relative;

  height: calc(100vh - 2*15px);
  padding: 15px;

  grid-template-columns: calc(20% - 12px) calc(20% - 12px) calc(20% - 12px) calc(20% - 12px) calc(20% - 12px);
  grid-template-rows: auto 1fr auto;
  grid-gap: 15px;

  justify-content: space-between;
`;

const Col = styled.div`
  position: relative;
`;

const MiniTitle = styled.span`
  text-transform: uppercase;

  font-weight: normal;
  font-size: 12px;
`;

const ColTitle = styled.h2`
  text-transform: uppercase;

  font-weight: normal;
  font-size: 12px;

  margin: 0 0 5px 5px;
  padding: 0;
`;

const PickList = styled.ul`
  border: 1px solid #000;

  box-shadow: 3px 3px 0 #ccc;

  padding: 3px 0;

  overflow-x: hidden;
  overflow-y: scroll;

  position: absolute;
  top: 20px;
  bottom: 0;
  right: 0;
  left: 0;
`;

const DetailBox = styled.div`
  border: 1px solid #000;

  box-shadow: 3px 3px 0 #ccc;

  padding: 10px;

  overflow-x: hidden;
  overflow-y: scroll;

  position: absolute;
  top: 20px;
  bottom: 0;
  right: 0;
  left: 0;
`;

const StatusBox = styled.div`
  padding: 10px;

  grid-column: 1 / -1;

  border: 3px double #000;
`;

interface Props {
  selected?: boolean;
  isSpecial?: boolean;
  last?: boolean;
}

const PickListItem = styled.li`
  padding: 2px 15px 2px 5px;

  cursor: pointer;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  background: ${(props: Props) => props.selected ? "#000" : "transparent"};
  color: ${(props: Props) => props.selected ? "#fff" : "#000"};

  ${(props: Props) => props.isSpecial ? "font-style: italic;" : ""}

  ${(props: Props) => !props.last ? `
    &::before {
      content: "▶";
      font-size: 10px;
      margin-right: -10px;
      color: ${(props2: Props) => props2.selected ? "#fff" : "#000"};
      float: right;
    }
  ` : ""}
`;

const PlayButton = styled.button`
  border: 1px solid #000;

  box-shadow: 3px 3px 0 #ccc;

  margin: 0 8px 0 0;
  padding: 3px;

  &:focus {
    outline:0;
  }

  &:hover {
    position: relative;

    top: -1px;
    left: -1px;

    box-shadow: 4px 4px 0 #ccc;
  }

  &:active {
    position: relative;

    top: 1px;
    left: 1px;

    box-shadow: 2px 2px 0 #ccc;
  }
`;

// -----

interface LabelRowProps {
  selectedLabel: Label | null;
  label: Label;
  onLabelSelected: (label: Label) => void;
}

const LabelRow = (props: LabelRowProps) => {
  const restProps = props.selectedLabel && props.label.id === props.selectedLabel.id ? { selected: true } : null;
  return <PickListItem {...restProps} isSpecial={props.label.special} onClick={(e) => props.onLabelSelected(props.label)}>{props.label.name}</PickListItem>;
};

interface ArtistRowProps {
  selectedArtist: Artist | null;
  artist: Artist;
  onArtistSelected: (artist: Artist) => void;
}

const ArtistRow = (props: ArtistRowProps) => {
  const restProps = props.selectedArtist && props.artist.id === props.selectedArtist.id ? { selected: true } : null;
  return <PickListItem {...restProps} isSpecial={false} onClick={(e) => props.onArtistSelected(props.artist)}>{props.artist.name}</PickListItem>;
};

interface AlbumRowProps {
  selectedAlbum: Album | null;
  album: Album;
  onAlbumSelected: (album: Album) => void;
}

const AlbumRow = (props: AlbumRowProps) => {
  const restProps = props.selectedAlbum && props.album.id === props.selectedAlbum.id ? { selected: true } : null;
  return <PickListItem {...restProps} onClick={(e) => props.onAlbumSelected(props.album)}>{props.album.name}</PickListItem>;
};

interface TrackRowProps {
  selectedTrack: Track | null;
  track: Track;
  onTrackSelected: (track: Track) => void;
}

const TrackRow = (props: TrackRowProps) => {
  const restProps = props.selectedTrack && props.track.id === props.selectedTrack.id ? { selected: true } : null;
  return <PickListItem {...restProps} onClick={(e) => props.onTrackSelected(props.track)} last>{props.track.disc_position}-{props.track.track_position} {props.track.name}</PickListItem>;
};

interface LabelsColProps {
  labels: Label[];
  selectedLabel: Label | null;
  onLabelSelected: (label: Label) => void;
}

const LabelsCol = (props: LabelsColProps) => (
  <Col>
    <ColTitle>Labels</ColTitle>
    <PickList>
      {
        Array.from(props.labels).map((l) => <LabelRow key={l.id} label={l} selectedLabel={props.selectedLabel} onLabelSelected={props.onLabelSelected} />)
      }
    </PickList>
  </Col>
);

interface ArtistsColProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  onArtistSelected: (artist: Artist) => void;
}

const ArtistsCol = (props: ArtistsColProps) => (
  <Col>
    <ColTitle>Artists</ColTitle>
    <PickList>
      {
        Array.from(props.artists).map((a) => <ArtistRow key={a.id} artist={a} selectedArtist={props.selectedArtist} onArtistSelected={props.onArtistSelected} />)
      }
    </PickList>
  </Col>
);

interface AlbumsColProps {
  albums: Album[];
  selectedAlbum: Album | null;
  onAlbumSelected: (album: Album) => void;
}

const AlbumsCol = (props: AlbumsColProps) => (
  <Col>
    <ColTitle>Releases</ColTitle>
    <PickList>
      {
        props.albums
          ? props.albums.map((a) => <AlbumRow key={a.id} album={a} selectedAlbum={props.selectedAlbum} onAlbumSelected={props.onAlbumSelected} />)
          : null
      }
    </PickList>
  </Col>
);

interface TracksColProps {
  tracks: Track[];
  selectedTrack: Track | null;
  onTrackSelected: (track: Track) => void;
}

const TracksCol = (props: TracksColProps) => (
  <Col>
    <ColTitle>Recordings</ColTitle>
    <PickList>
      {
        props.tracks
          ? props.tracks.map((a) => <TrackRow key={a.id} track={a} selectedTrack={props.selectedTrack} onTrackSelected={props.onTrackSelected} />)
          : null
      }
    </PickList>
  </Col>
);

interface TrackDetailsProps {
  track: Track;
  onTrackPlayButtonClicked: (track: Track) => void;
}

const TrackDetails = (props: TrackDetailsProps) => (
  <React.Fragment>
    <PlayButton onClick={(e) => props.onTrackPlayButtonClicked(props.track)}>PLAY</PlayButton>

    <dl>
      <dt>Title</dt>
      <dd>{props.track.name}</dd>

      <dt>Artist</dt>
      <dd>{props.track.artist.name}</dd>

      <dt>Release</dt>
      <dd>{props.track.album.name}</dd>

      <dt>Release date</dt>
      <dd>{props.track.recording_time || "(unknown)"}</dd>

      <dt>Label</dt>
      <dd>{props.track.album.label ? props.track.album.label.name : "(not on label)"}</dd>
    </dl>
  </React.Fragment>
);

interface TrackColProps {
  selectedTrack: Track | null;
  onTrackPlayButtonClicked: (track: Track) => void;
}

const TrackCol = (props: TrackColProps) => (
  <Col>
    <ColTitle>Selected recording</ColTitle>
    <DetailBox>
      { props.selectedTrack ? <TrackDetails track={props.selectedTrack} onTrackPlayButtonClicked={props.onTrackPlayButtonClicked} /> : null }
    </DetailBox>
  </Col>
);

interface ActivePlayerProps {
  onPlaybackEnded: (t: PlayingTrack) => void;
  playingTrack: PlayingTrack;
}

const ActivePlayer = (props: ActivePlayerProps) => (
  <div>
    {
      props.playingTrack.mediaURL
        ? <audio
            style={{ float: "right", width: "500px" }}
            controls
            autoPlay
            onEnded={() => props.onPlaybackEnded(props.playingTrack)}
            src={props.playingTrack.mediaURL}
          />
        : "…"
    }
    <MiniTitle>Now playing</MiniTitle><br />{props.playingTrack.artist.name} – {props.playingTrack.name}
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

const Player = (props: PlayerProps) => (
  <StatusBox>
    {
      props.playingTrack
        ? <ActivePlayer playingTrack={props.playingTrack} onPlaybackEnded={props.onPlaybackEnded} />
        : <IdlePlayer />
    }
  </StatusBox>
);

const App = (props: AppProps) => (
  <Page>
    <Grid>
      <H1>D★<b>Tune</b></H1>
      <LabelsCol {...props} />
      <ArtistsCol {...props} />
      <AlbumsCol {...props} />
      <TracksCol {...props} />
      <TrackCol {...props} />
      <Player {...props} />
    </Grid>
  </Page>
);

export interface AppProps {
  labels: Label[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];

  selectedLabel: Label | null;
  selectedArtist: Artist | null;
  selectedAlbum: Album | null;
  selectedTrack: Track | null;

  onLabelSelected: (label: Label) => void;
  onArtistSelected: (artist: Artist) => void;
  onAlbumSelected: (album: Album) => void;
  onTrackSelected: (track: Track) => void;

  onTrackPlayButtonClicked: (track: Track) => void;
  playingTrack: PlayingTrack | null;

  onPlaybackEnded: (t: PlayingTrack) => void;
}

export default App;
