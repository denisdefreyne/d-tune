# frozen_string_literal: true

module DTune
  module Indexer
    class FileFinder
      def initialize(prefix:, extensions:)
        @prefix = prefix
        @extensions = Set.new(extensions)
      end

      def each
        return enum_for(__method__) unless block_given?

        Find.find(@prefix) do |filename|
          next if filename.match?(%r{(/|^)\.})
          next unless @extensions.include?(File.extname(filename))
          next unless File.file?(filename)

          yield(filename)
        end
      end
    end
  end
end
