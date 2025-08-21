require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module DataSourceService
  class Application < Rails::Application
    config.load_defaults 7.1
    config.autoload_lib(ignore: %w(assets tasks))
    config.api_only = true

    config.active_record.record_timestamps = false
  end
end
