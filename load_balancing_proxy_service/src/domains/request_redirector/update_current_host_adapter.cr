require "./infrastructure/specifications/request_redirector_specifications"

class UpdateCurrentHostAdapter
  def self.get_updated_host_index(current_host_index : Int32) : Int32
    if RequestRedirectorSpecifications.is_current_host_index_the_last(current_host_index)
      0
    else
      current_host_index + 1
    end
  end
end
