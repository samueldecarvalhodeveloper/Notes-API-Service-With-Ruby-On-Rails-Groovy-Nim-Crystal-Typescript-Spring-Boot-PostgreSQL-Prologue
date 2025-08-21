require "../../../../../spec_helper"

describe RequestRedirectorSpecifications do
  it "Test If Method \"is_current_host_index_the_last\" Returns True If Current Index Is The Last Of List Of Host Names" do
    current_index_is_the_last =
      RequestRedirectorSpecifications.is_current_host_index_the_last LIST_OF_HOST_NAMES.size - 1
    current_index_is_not_the_last =
      RequestRedirectorSpecifications.is_current_host_index_the_last 0

    current_index_is_the_last.should be_true
    current_index_is_not_the_last.should be_false
  end
end
