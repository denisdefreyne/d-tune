# frozen_string_literal: true

STDOUT.sync = true
STDERR.sync = true

require 'dotenv'
Dotenv.load

require_relative 'lib/d-tune'

run DTune::Server::App
