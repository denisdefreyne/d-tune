# frozen_string_literal: true

module DTune
  module Util
    class B2Client
      B2_BASE_URL = 'https://api.backblazeb2.com'

      def initialize(account_id:, application_key:)
        @account_id = account_id
        @application_key = application_key
      end

      def connect
        DTune::Util::Future.new do
          puts "[#{self.class}] Connecting…"

          connection = Excon.new(
            B2_BASE_URL,
            persistent: true
          )

          response = connection.get(
            path: '/b2api/v1/b2_authorize_account',
            user: @account_id,
            password: @application_key
          )

          raise "invalid response: #{response.inspect}" if response.status != 200

          body = JSON.parse(response.body)

          auth_token = body.fetch('authorizationToken')
          api_url = body.fetch('apiUrl')

          conn = DTune::Util::B2Connection.new(
            account_id: @account_id,
            api_url: api_url,
            auth_token: auth_token
          )
          puts "[#{self.class}] Connected"
          conn
        end
      end
    end
  end
end
