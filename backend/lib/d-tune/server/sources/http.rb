# frozen_string_literal: true

module DTune
  module Server
    module Sources
      class HTTP < DTune::Server::Source
        identifier :http

        def self.new_from_env
          new(
            base_url: ENV.fetch('SERVER_SOURCE_HTTP_BASE_URL')
          )
        end

        def initialize(base_url:)
          @base_url = base_url.sub(%r{/$}, '')
        end

        def connect; end

        def make_download_url(filename)
          @base_url + '/' + filename
        end
      end
    end
  end
end
