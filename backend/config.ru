# frozen_string_literal: true

require 'dotenv'
Dotenv.load

require_relative 'lib/d-play'

run DPlay::Server::App
