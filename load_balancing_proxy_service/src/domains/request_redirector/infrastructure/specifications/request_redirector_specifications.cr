require "../../../../constants/application_constants"

class RequestRedirectorSpecifications
  def self.is_current_host_index_the_last(current_index : Int32)
    LIST_OF_HOST_NAMES.size - 1 == current_index
  end
end
