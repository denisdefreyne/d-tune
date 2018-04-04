import * as React from "react";

import App, { AppProps } from "../components/App";

import authenticated, { InjectedProps as AuthenticatedProps } from "../hoc/Authenticated";

import API, { TrackDetailsResponse } from "../services/api";

import Album from "../types/album";
import Artist from "../types/artist";
import Label, { SpecialID as SpecialLabelID } from "../types/label";
import Library from "../types/library";
import PlayingTrack from "../types/playing_track";
import Track from "../types/track";

import { byName, isNotUndefined, uniq } from "../util";

interface AppState {
  library: Library;

  selectedLabel: Label | null;
  selectedArtist: Artist | null;
  selectedAlbum: Album | null;
  selectedTrack: Track | null;

  playingTrack: PlayingTrack | null;
}

interface AppContainerProps {
  baseURL: string;
}

// Utils

function compareLabels(a: Label, b: Label) {
  if (a.id === SpecialLabelID.ANY) {
    return -1;
  }

  if (b.id === SpecialLabelID.ANY) {
    return 1;
  }

  if (a.id === SpecialLabelID.NONE) {
    return -1;
  }

  if (b.id === SpecialLabelID.NONE) {
    return 1;
  }

  return a.name.localeCompare(b.name);
}

function byTrackAndDiscPosition(a: Track, b: Track) {
  return a.disc_position === b.disc_position
    ? a.track_position - b.track_position
    : (a.disc_position || 1) - (b.disc_position || 1);
}

class AppContainer extends React.Component<AppContainerProps & AuthenticatedProps, AppState> {
  constructor(props: AppContainerProps & AuthenticatedProps) {
    super(props);

    this.state = {
      library: {
        labels: [],
        artists: [],
        albums: [],
        tracks: [],
      },

      selectedLabel: null,
      selectedArtist: null,
      selectedAlbum: null,
      selectedTrack: null,

      playingTrack: null,
    };
  }

  public componentDidMount() {
    API.fetchEverything(this.props.baseURL, this.props.getIdToken(), this.onFetchSuccess, this.onFetchFailure);
  }

  public onFetchSuccess = (library: Library) => {
    const specialLabels = [
      { isSpecial: true, id: SpecialLabelID.ANY, name: "(any)" },
      { isSpecial: true, id: SpecialLabelID.NONE, name: "(none)" },
    ];

    const labels = library.labels.concat(specialLabels);

    this.setState({ library: {...library, labels} });
  }

  public onFetchFailure = () => {
    console.log("Sorry! Something went wrong.");
  }

  public onLabelSelected = (label: Label) => {
    this.setState((prevState: AppState, props: AppContainerProps) => ({
      library: prevState.library,
      selectedLabel: label,
      selectedArtist: this.artistsForLabel(label).filter((a) => a === prevState.selectedArtist).length ? prevState.selectedArtist : null,
      selectedAlbum: null,
      selectedTrack: null,
    }));
  }

  public onArtistSelected = (artist: Artist) => {
    this.setState({
      selectedArtist: artist,
      selectedAlbum: null,
      selectedTrack: null,
    });
  }

  public onAlbumSelected = (album: Album) => {
    this.setState({
      selectedAlbum: album,
      selectedTrack: null,
    });
  }

  public onFetchTrackSuccess = (track: Track) => (res: TrackDetailsResponse) => {
    this.setState((prevState: AppState, props: AppContainerProps): AppState =>
      prevState.playingTrack
        ? { ...prevState, playingTrack: { ...prevState.playingTrack, mediaURL: res.track.media_url } }
        : { ...prevState, playingTrack: { track, mediaURL: res.track.media_url } },
    );
  }

  public onFetchTrackFailure = () => {
    // TODO: handle failure
  }

  public onTrackSelected = (track: Track) => {
    this.setState({
      selectedTrack: track,
    });
  }

  public onTrackPlayButtonClicked = (track: Track) => {
    this.doPlayTrack(track);
  }

  public onPlaybackEnded = (playingTrack: PlayingTrack) => {
    const albumTracks = this.tracksForAlbum(playingTrack.track.album);

    const comesAfter = (a: Track, b: Track) =>
      (a.disc_position === b.disc_position && a.track_position === b.track_position + 1) ||
      (a.disc_position === b.disc_position + 1 && a.track_position === 1);

    const nextTrack = albumTracks.find((t: Track) => comesAfter(t, playingTrack.track));
    if (nextTrack) {
      this.doPlayTrack(nextTrack);
    }
  }

  // Actions

  public doPlayTrack = (track: Track) => {
    this.setState({
      playingTrack: { track },
    });

    API.fetchTrack(track.id, this.props.baseURL, this.props.getIdToken(), this.onFetchTrackSuccess(track), this.onFetchTrackFailure);
  }

  // Filtering

  public isLabelOnAlbum = (album: Album, label: Label) =>
    label.id === SpecialLabelID.ANY
      ? true
      : label.id === SpecialLabelID.NONE
        ? !album.label_id
        : album.label_id === label.id

  public albumsForLabel = (label: Label) =>
    label.id === SpecialLabelID.ANY
      ? this.state.library.albums
      : label.id === SpecialLabelID.NONE
        ? uniq(this.state.library.albums.filter((a) => !a.label_id))
        : uniq(this.state.library.albums.filter((a) => a.label_id === label.id))

  public artistsForLabel = (label: Label): Artist[] =>
    this.artistsForAlbums(this.albumsForLabel(label))

  public artistsForAlbums = (albums: Album[]): Artist[] =>
    uniq(albums.map((a) => a.artist_id))
      .map((artistID) => this.state.library.artists.find((a) => a.id === artistID))
      .filter(isNotUndefined)

  public albumsForLabelAndArtist = (label: Label, artist: Artist): Album[] =>
    this.state.library.albums
      .filter((a) => this.isLabelOnAlbum(a, label) && a.artist_id === artist.id)

  public tracksForAlbum = (album: Album): Track[] =>
    this.state.library.tracks.filter((t) => t.album_id === album.id)

  // UI filtering

  public labelsToShow = (): Label[] =>
    this.state.library.labels.sort(compareLabels)

  public artistsToShow = (): Artist[] =>
    this.state.selectedLabel
      ? this.artistsForLabel(this.state.selectedLabel).sort(byName)
      : []

  public albumsToShow = (): Album[] =>
    this.state.selectedLabel && this.state.selectedArtist
      ? this.albumsForLabelAndArtist(this.state.selectedLabel, this.state.selectedArtist).sort(byName)
      : []

  public tracksToShow = (): Track[] =>
    this.state.selectedAlbum
      ? this.tracksForAlbum(this.state.selectedAlbum).sort(byTrackAndDiscPosition)
      : []

  // Render

  public render() {
    return (
      <App
        labels={this.labelsToShow()}
        artists={this.artistsToShow()}
        albums={this.albumsToShow()}
        tracks={this.tracksToShow()}

        selectedLabel={this.state.selectedLabel}
        selectedArtist={this.state.selectedArtist}
        selectedAlbum={this.state.selectedAlbum}
        selectedTrack={this.state.selectedTrack}

        onLabelSelected={this.onLabelSelected}
        onArtistSelected={this.onArtistSelected}
        onAlbumSelected={this.onAlbumSelected}
        onTrackSelected={this.onTrackSelected}

        onTrackPlayButtonClicked={this.onTrackPlayButtonClicked}
        playingTrack={this.state.playingTrack}

        onPlaybackEnded={this.onPlaybackEnded}
      />
    );
  }
}

export default authenticated({ debug: true })(AppContainer);
