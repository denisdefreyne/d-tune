# frozen_string_literal: true

module DTune
  module Indexers
    module FS
      class Importer
        def initialize(output_file_path:)
          @output_file_path = output_file_path
        end

        def run(enum)
          connect do |db|
            puts 'Importing raw data…'
            import_raw(enum, db)

            puts 'Importing artists…'
            import_artists(db)

            puts 'Importing labels…'
            import_labels(db)

            puts 'Importing albums…'
            import_albums(db)

            puts 'Importing tracks…'
            import_tracks(db)

            puts 'Done'
          end
        end

        private

        def import_artists(db)
          db.create_table(:artists) do
            primary_key :id
            String :name
            unique [:name]
          end

          artists_table = db.from(:artists)

          album_artists = db.from(:raw).distinct.select_map(:album_artist)
          artists = db.from(:raw).distinct.select_map(:artist)
          (artists + album_artists).uniq.each do |artist|
            artists_table.insert(name: artist)
          end
        end

        def import_labels(db)
          db.create_table(:labels) do
            primary_key :id
            String :name

            unique [:name]
          end

          labels_table = db.from(:labels)

          labels = db.from(:raw).distinct.select_map(:label).reject { |l| l.nil? || l.empty? }
          labels.uniq.each do |label|
            labels_table.insert(name: label)
          end
        end

        def import_albums(db)
          db.create_table(:albums) do
            primary_key :id
            String :name
            Integer :label_id
            Integer :artist_id

            unique %i[artist_id name]
          end

          albums_table = db.from(:albums)
          artists_table = db.from(:artists)
          labels_table = db.from(:labels)

          rows = db.from(:raw).distinct.select(:album, :artist, :album_artist, :label)
          rows.each do |row|
            album_artist = normalize_string(row[:album_artist]) || row[:artist]
            label = row[:label]

            artist_id = artists_table.where(name: album_artist).first[:id]
            label_id = labels_table.where(name: label).map { |l| l[:id] }.first

            albums_table.insert_ignore.insert(name: row[:album], artist_id: artist_id, label_id: label_id)
          end
        end

        def import_tracks(db)
          db.create_table(:tracks) do
            primary_key :id
            String :name
            Integer :track_position
            Integer :disc_position
            Integer :artist_id
            Integer :album_id
            String :filename
            String :recording_time
            String :label
            String :isrc
            String :musicbrainz_id
            Float :duration
            Integer :compilation

            unique %i[artist_id album_id track_position disc_position]
          end

          tracks_table = db.from(:tracks)
          albums_table = db.from(:albums)
          artists_table = db.from(:artists)

          db.from(:raw).each do |row|
            artist_name = normalize_string(row[:artist]) || row[:album_artist]
            album_artist_name = normalize_string(row[:album_artist]) || row[:artist]

            artist_id = artists_table.where(name: artist_name).first[:id]
            album_artist_id = artists_table.where(name: album_artist_name).first[:id]
            album_id = albums_table.where(name: row[:album], artist_id: album_artist_id).first[:id]

            tracks_table.insert_ignore.insert(
              name: row[:title],
              track_position: row[:track_position],
              disc_position: row[:disc_position],
              artist_id: artist_id,
              album_id: album_id,
              filename: row[:filename],
              recording_time: row[:recording_time],
              duration: row[:duration],
              isrc: row[:isrc],
              musicbrainz_id: row[:musicbrainz_id]
            )
          end
        end

        def normalize_string(str)
          str.nil? || str.empty? ? nil : str
        end

        def connect
          FileUtils.rm_f(@output_file_path)
          Sequel.connect('sqlite://' + @output_file_path) do |db|
            yield(db)
          end
        end

        def import_raw(enum, db)
          db.create_table(:raw) do
            String :filename
            Integer :mtime
            String :track_position
            String :disc_position
            String :artist
            String :album_artist
            String :album
            String :title
            String :recording_time
            String :label
            String :isrc
            String :musicbrainz_id
            Integer :compilation
            Float :duration
          end

          raw_table = db.from(:raw)
          enum.each do |e|
            raw_table.insert(e.to_h)
          end
        end
      end
    end
  end
end
