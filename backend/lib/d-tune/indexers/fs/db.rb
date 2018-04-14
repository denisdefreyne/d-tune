# frozen_string_literal: true

module DTune
  module Indexers
    module FS
      class DB
        def initialize(path:)
          @path = path
        end

        def connect
          FileUtils.rm_f(@path)
          Sequel.connect('sqlite://' + @path) do |db|
            yield(db)
          end
        end
      end
    end
  end
end
