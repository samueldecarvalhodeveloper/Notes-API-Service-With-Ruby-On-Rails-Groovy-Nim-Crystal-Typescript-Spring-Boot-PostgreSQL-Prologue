require "../../../spec_helper"

describe UpdateCurrentHostAdapter do
  it "Test If Method \"get_updated_host_index\" Returns Next Host Name; If Current Index Is The Last, Return First Index" do
    updated_from_last_index = UpdateCurrentHostAdapter.get_updated_host_index LIST_OF_HOST_NAMES.size - 1

    updated_from_not_the_last_index = UpdateCurrentHostAdapter.get_updated_host_index (LIST_OF_HOST_NAMES.size - 1) - 1

    updated_from_last_index.should eq 0

    updated_from_not_the_last_index.should eq LIST_OF_HOST_NAMES.size - 1
  end
end
