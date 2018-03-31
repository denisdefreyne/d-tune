# frozen_string_literal: true

module DPlay
  module Util
    class B2Connection
      attr_reader :auth_token
      attr_reader :api_url

      def initialize(account_id:, api_url:, auth_token:)
        @account_id = account_id
        @api_url = api_url
        @auth_token = auth_token
      end

      def buckets
        response = connection.get(
          path: '/b2api/v1/b2_list_buckets',
          query: { 'accountId' => @account_id },
          headers: { 'Authorization' => @auth_token }
        )

        raise "invalid response: #{response.inspect}" if response.status != 200

        body = JSON.parse(response.body)
        body.fetch('buckets').map do |b|
          {
            id: b.fetch('bucketId'),
            name: b.fetch('bucketName'),
            type: b.fetch('bucketType')
          }
        end
      end

      def authorize_download(bucket_id:, bucket_name:, filename:)
        query = {
          'bucketId' => bucket_id,
          'fileNamePrefix' => filename,
          'validDurationInSeconds' => 60 * 60 * 24
        }

        response = connection.get(
          path: '/b2api/v1/b2_get_download_authorization',
          query: query,
          headers: { 'Authorization' => @auth_token }
        )

        raise "invalid response: #{response.inspect}" if response.status != 200

        body = JSON.parse(response.body)
        "#{@api_url}/file/#{bucket_name}/#{uri_encode(filename)}?Authorization=#{body.fetch('authorizationToken')}"
      end

      private

      def uri_encode(str)
        URI.encode_www_form_component(str).gsub('%2F', '/')
      end

      def connection
        @connection ||= Excon.new(
          @api_url,
          persistent: true
        )
      end
    end
  end
end
