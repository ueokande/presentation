require 'middleman-core/renderers/redcarpet'
require 'active_support/core_ext/module/attribute_accessors'

module Middleman
  module Renderers
    class RedcarpetPresentationTemplate < RedcarpetTemplate
    end

    ::Tilt.register RedcarpetPresentationTemplate, 'markdown', 'mkd', 'md'
  end
end
