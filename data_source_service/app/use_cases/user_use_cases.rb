class UserUseCases
  def self.get_user id
    User.find id
  end

  def self.get_all_users
    User.all
  end

  def self.create_user username, id
    User.create username: username, id: id
  end

  def self.update_user username, id
    user_to_be_updated = User.find id

    user_to_be_updated.username = username

    user_to_be_updated.save
  end

  def self.delete_user id
    user_to_be_deleted = User.find id

    user_to_be_deleted.destroy
  end
end
