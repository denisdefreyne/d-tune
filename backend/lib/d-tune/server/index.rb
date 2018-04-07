# frozen_string_literal: true

module DTune
  module Server
    class Index
      def self.new_from_env
        new(db_url: 'sqlite://' + ENV.fetch('SERVER_INDEX_DB_PATH'))
      end

      def initialize(db_url:)
        @db_url = db_url
      end

      def connect
        puts "[#{self.class}] Connecting…"
        @db = Sequel.connect(@db_url)
        puts "[#{self.class}] Connected"
        self
      end

      def everything
        %i[labels artists albums tracks].each_with_object({}) do |sym, res|
          res[sym] = @db[sym].to_a
        end
      end

      def track(track_id:)
        items = @db['SELECT * FROM tracks WHERE id = ?', track_id]
        items.first&.to_hash
      end
    end
  end
end
