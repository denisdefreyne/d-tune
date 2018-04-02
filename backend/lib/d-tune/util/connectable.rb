# frozen_string_literal: true

module DTune
  module Util
    module Connectable
      # Requires #connect method.

      def connect_async
        @__dplay_util_connectable__connected = false
        @__dplay_util_connectable__connect_mutex = Mutex.new

        Thread.new do
          Thread.current.abort_on_exception = true

          @__dplay_util_connectable__connect_mutex.lock
          next if @__dplay_util_connectable__connected

          puts "[#{self.class}] Connecting…"
          connect
          puts "[#{self.class}] Connected"

          @__dplay_util_connectable__connect_mutex.unlock
        end

        self
      end

      def await_connection
        return if @__dplay_util_connectable__connected
        @__dplay_util_connectable__connect_mutex.synchronize {}
      end
    end
  end
end
