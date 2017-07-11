# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions
require 'lib/middleman/renderers/redcarpet_presentation'

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

set :markdown_engine_prefix, Middleman::Renderers
set :markdown_engine, :redcarpet_presentation

ready do
  sitemap.resources.select{ |r| r.parent && r.parent.page_id == 'index' }.each do |page|
    layout = File.expand_path(File.join('/', page.path, '..', 'layout'))
    page page.path, layout: layout
  end
end
