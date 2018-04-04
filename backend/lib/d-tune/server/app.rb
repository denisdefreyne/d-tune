# frozen_string_literal: true

module DTune
  module Server
    class App < Sinatra::Base
      use Rack::CommonLogger

      use Rack::Cors do
        allow do
          origins 'http://localhost:1234', 'https://d-tune.denis.ws'
          resource '*', headers: ['dtune-access-token'], methods: [:get]
        end
      end

      set :index, DTune::Server::Index.new_from_env.connect_async

      server_source_type = ENV.fetch('SERVER_SOURCE_TYPE')
      server_source_class = DTune::Server::Source.named(server_source_type)
      set :source, server_source_class.new_from_env.connect_async

      set :token_validator, GoogleIDToken::Validator.new
      set :client_id, ENV.fetch('SERVER_AUTH_CLIENT_ID')
      set :permitted_emails, Set.new(ENV.fetch('SERVER_AUTH_PERMITTED_EMAILS').split(','))

      before do
        content_type :json

        begin
          token = request.env['HTTP_DTUNE_ACCESS_TOKEN']
          payload = settings.token_validator.check(token, settings.client_id)

          email = payload.fetch('email')
          unless settings.permitted_emails.include?(email)
            body JSON.dump(reason: 'You are not Denis.')
            halt 403
          end
        rescue GoogleIDToken::ValidationError => e
          body JSON.dump(reason: 'Your token is invalid.')
          halt 403
        end
      end

      get '/test' do
        json success: true
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
