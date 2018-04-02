# frozen_string_literal: true

module DTune
  module Indexer
    class Sanitizer
      def initialize
        @non_label_regex = /not on label|no label/i
      end

      def call(track)
        track.merge(
          label: sanitize_label(track[:label])
        )
      end

      private

      def sanitize_label(label)
        if @non_label_regex.match?(label)
          nil
        else
          label
        end
      end
    end
  end
end
