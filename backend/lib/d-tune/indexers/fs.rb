# frozen_string_literal: true

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
        DTune::Indexers::FS::Fetcher.new(
          input_directory_path: source,
          output_file_path: target,
          parallelism: 10
        ).run
      end
    end
  end
end

require_relative 'fs/db'
require_relative 'fs/parser'
require_relative 'fs/fetcher'
require_relative 'fs/importer'
require_relative 'fs/sanitizer'
