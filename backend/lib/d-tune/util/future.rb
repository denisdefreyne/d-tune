# frozen_string_literal: true

module DTune
  module Util
    class Future
      def initialize
        raise ArgumentError unless block_given?

        @thread =
          Thread.new do
            Thread.current.abort_on_exception = true
            @result = yield
          end
      end

      def await
        @thread.join
        @result
      end

      def map
        self.class.new { yield(await) }
      end
    end
  end
end
