# frozen_string_literal: true

module DTune
  module Server
    module Sources
      class B2 < DTune::Server::Source
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
          @client = DTune::Util::B2Client.new(
            account_id: @account_id,
            application_key: @application_key
          )

          @bucket_f =
            @client.connect.map do |conn|
              puts "[#{self.class}] Finding bucket…"
              bucket = conn.buckets.find { |b| b[:name] == @bucket_name }
              puts "[#{self.class}] Found bucket"
              bucket
            end
        end

        def make_download_url(filename)
          puts "[#{self.class}] Making download URL…"
          bucket = @bucket_f.await
          url = @client.connect.map do |conn|
            conn.authorize_download(
              bucket_id: bucket[:id],
              bucket_name: bucket[:name],
              filename: @prefix + filename
            )
          end.await
          puts "[#{self.class}] Made download URL"
          url
        end
      end
    end
  end
end
