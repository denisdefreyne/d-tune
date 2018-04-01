# frozen_string_literal: true

module DPlay
  module Server
    module Sources
      class B2 < DPlay::Server::Source
        identifier :b2

        def self.new_from_env
          new(
            account_id: ENV.fetch('SERVER_SOURCE_B2_ACCOUNT_ID'),
            application_key: ENV.fetch('SERVER_SOURCE_B2_APPLICATION_KEY'),
            bucket_name: ENV.fetch('SERVER_SOURCE_B2_BUCKET_NAME'),
            prefix: ENV.fetch('SERVER_SOURCE_B2_PREFIX')
          )
        end

        def initialize(account_id:, application_key:, bucket_name:, prefix:)
          @account_id = account_id
          @application_key = application_key
          @bucket_name = bucket_name
          @prefix = prefix
        end

        def connect
          client = DPlay::Util::B2Client.new(
            account_id: @account_id,
            application_key: @application_key
          )

          @conn = client.connect
          @bucket = @conn.buckets.find { |b| b[:name] == @bucket_name }
        end

        def make_download_url(filename)
          await_connection

          @conn.authorize_download(
            bucket_id: @bucket[:id],
            bucket_name: @bucket[:name],
            filename: @prefix + filename
          )
        end
      end
    end
  end
end
