# frozen_string_literal: true

module DTune
  module Server
    class Source
      extend DDPlugin::Plugin
      include DTune::Util::Connectable
    end
  end
end
