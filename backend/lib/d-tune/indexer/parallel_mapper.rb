# frozen_string_literal: true

module DTune
  module Indexer
    class ParallelMapper
      def initialize(enum:, parallelism:, &block)
        @enum = enum
        @parallelism = parallelism
        @block = block
      end

      def each
        return enum_for(__method__) unless block_given?

        q = SizedQueue.new(5 * @parallelism)

        q_thread =
          Thread.new do
            Thread.current.abort_on_exception = true

            @enum.each { |e| q << e }
            q.close
          end

        mutex = Mutex.new

        threads = Array.new(@parallelism) do
          Thread.new do
            Thread.current.abort_on_exception = true

            while e = q.pop
              res = @block.call(e)
              mutex.synchronize { yield(res) }
            end
          end
        end

        threads.each(&:join)
        q_thread.join
      end
    end
  end
end
