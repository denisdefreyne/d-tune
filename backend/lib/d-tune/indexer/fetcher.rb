# frozen_string_literal: true

module B2Player
  module Indexer
    class Fetcher
      def initialize(input_directory_path:, output_file_path:, parallelism:)
        @input_directory_path = input_directory_path
        @output_file_path = output_file_path
        @parallelism = parallelism
      end

      def run
        filenames =
          B2Player::Indexer::ProgressLogger.new(
            enum: B2Player::Indexer::FileFinder.new(
              prefix: @input_directory_path,
              extensions: ['.mp3', '.m4a']
            ).each,
            out: $stderr
          ).each.lazy

        sanitizer = B2Player::Indexer::Sanitizer.new
        parser = B2Player::Indexer::Parser.new
        mapper =
          B2Player::Indexer::ParallelMapper.new(enum: filenames, parallelism: @parallelism) do |fn|
            {
              filename: fn.delete_prefix(@input_directory_path).delete_prefix('/'),
              properties: sanitizer.call(parser.parse_file(fn))
            }
          end

        CSV.open(@output_file_path, 'w') do |csv|
          properties =
            %i[track_position disc_position artist album_artist album title recording_time compilation label isrc musicbrainz_id duration]
          csv << [:filename] + properties

          mapper.each do |e|
            csv << [e[:filename], *e[:properties].values_at(*properties)]
          end
        end
      end
    end
  end
end
