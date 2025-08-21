class VerifyIfUserExistsCommand
  def self.execute id
    UserUseCases.get_user id
  end
end
