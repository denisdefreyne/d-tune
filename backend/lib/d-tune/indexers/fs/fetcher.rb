# frozen_string_literal: true

module DTune
  module Indexers
    module FS
      class Fetcher
        PROPERTIES =
          %i[track_position disc_position artist album_artist album title recording_time compilation label isrc musicbrainz_id duration].freeze

        def initialize(input_directory_path:, output_file_path:, parallelism:)
          @input_directory_path = input_directory_path
          @output_file_path = output_file_path
          @parallelism = parallelism
        end

        def run
          filenames =
            DTune::Util::ProgressLogger.new(
              enum: DTune::Util::FileFinder.new(
                prefix: @input_directory_path,
                extensions: ['.mp3', '.m4a']
              ).each,
              out: $stderr
            ).each.lazy

          sanitizer = DTune::Indexers::FS::Sanitizer.new
          parser = DTune::Indexers::FS::Parser.new
          mapper =
            DTune::Util::ParallelMapper.new(enum: filenames, parallelism: @parallelism) do |fn|
              {
                filename: fn.delete_prefix(@input_directory_path).delete_prefix('/'),
                properties: sanitizer.call(parser.parse_file(fn)),
                mtime: File.stat(fn).mtime.to_i
              }
            end

          rows = mapper.map do |e|
            e[:properties].slice(*PROPERTIES).merge(e.slice(:filename, :mtime))
          end

          DTune::Indexers::FS::DB.new(path: @output_file_path).connect do |db|
            DTune::Indexers::FS::Importer.new(db: db).run(rows)
          end

          parser.report
        end
      end
    end
  end
end
