require 'csv'
require 'fileutils'
require 'find'
require 'sequel'
require 'set'
require 'taglib'
require 'tmpdir'

module DTune
  module Indexers
    module FS
      def self.call(source:, target:)
        Tempfile.create('d-tune-import.csv') do |f|
          f.close

          DTune::Indexers::FS::Fetcher.new(
            input_directory_path: source,
            output_file_path: f.path,
            parallelism: 10
          ).run

          DTune::Indexers::FS::Importer.new(
            input_file_path: f.path,
            output_file_path: target
          ).run
        end
      end
    end
  end
end

require_relative 'fs/parser'
require_relative 'fs/fetcher'
require_relative 'fs/importer'
require_relative 'fs/sanitizer'
