# frozen_string_literal: true

module DTune
  module Server
    class Authenticator
      class Error < ::StandardError
      end

      def initialize(client_id)
        @token_validator = GoogleIDToken::Validator.new
        @client_id = client_id
      end

      def run(env)
        token = env['HTTP_DTUNE_ACCESS_TOKEN']
        @token_validator.check(token, @client_id)
      rescue GoogleIDToken::ValidationError
        raise Error
      end
    end

    class App < Sinatra::Base
      use Rack::CommonLogger

      use Rack::Cors do
        allow do
          origins 'http://localhost:1234', 'https://d-tune.denis.ws'
          resource '*', headers: ['dtune-access-token'], methods: [:get]
        end
      end

      set :index, DTune::Server::Index.new_from_env.tap(&:connect)

      server_source_type = ENV.fetch('SERVER_SOURCE_TYPE')
      server_source_class = DTune::Server::Source.named(server_source_type)
      set :source, server_source_class.new_from_env.tap(&:connect)

      set :permitted_emails, Set.new(ENV.fetch('SERVER_AUTH_PERMITTED_EMAILS').split(','))
      set :authenticator, Authenticator.new(ENV.fetch('SERVER_AUTH_CLIENT_ID'))

      before do
        content_type :json

        begin
          payload = settings.authenticator.run(request.env)

          email = payload.fetch('email')
          unless settings.permitted_emails.include?(email)
            body JSON.dump(reason: 'You are not Denis.')
            halt 403
          end
        rescue Authenticator::Error
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
