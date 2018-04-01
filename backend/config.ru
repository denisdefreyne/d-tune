# frozen_string_literal: true

require 'dotenv'
Dotenv.load

require_relative 'lib/d-tune'

run DPlay::Server::App
