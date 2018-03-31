# frozen_string_literal: true

module DPlay
  module Server
    class Source
      extend DDPlugin::Plugin
      include DPlay::Util::Connectable
    end
  end
end
