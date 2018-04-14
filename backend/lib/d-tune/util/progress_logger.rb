# frozen_string_literal: true

module DTune
  module Util
    class ProgressLogger
      def initialize(enum:, out:)
        @enum = enum
        @out = out
      end

      def each
        return enum_for(__method__) unless block_given?

        i = 0
        @enum.each do |e|
          @out << "\e[G#{i}\e[K\e[G"
          i += 1

          yield(e)
        end
      end
    end
  end
end
