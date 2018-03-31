# frozen_string_literal: true

module DPlay
  module Server
    class App < Sinatra::Base
      use Rack::CommonLogger

      set :index, DPlay::Server::Index.new_from_env.connect_async

      server_source_type = ENV.fetch('SERVER_SOURCE_TYPE')
      server_source_class = DPlay::Server::Source.named(server_source_type)
      set :source, server_source_class.new_from_env.connect_async

      before do
        content_type :json
        response['Access-Control-Allow-Origin'] = '*'
      end

      get '/everything' do
        json settings.index.everything
      end

      get '/tracks/:id' do
        track = settings.index.track(track_id: params[:id])
        json track: { media_url: settings.source.make_download_url(track[:filename]) }
      end
    end
  end
end
