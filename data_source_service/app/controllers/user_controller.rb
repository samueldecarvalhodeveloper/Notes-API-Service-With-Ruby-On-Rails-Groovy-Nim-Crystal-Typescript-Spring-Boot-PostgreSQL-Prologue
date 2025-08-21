class UserController < ApplicationController
  def get_all_users
    all_users = UserUseCases.get_all_users

    render json: all_users, status: 200
  end

  def get_user
    begin
      id = params[:id]

      user = UserUseCases.get_user id

      render json: user, status: 200
    rescue StandardError
      render status: 404
    end
  end

  def create_user
    begin
      serialize_request_body = JSON.parse request.raw_post

      id = serialize_request_body[UserConstants::USER_MAP_ID_KEY]
      username = serialize_request_body[UserConstants::USER_MAP_USERNAME_KEY]

      UserUseCases.create_user username, id

      render status: 201
    rescue StandardError
      render status: 409
    end
  end

  def update_user
    begin
      serialize_request_body = JSON.parse request.raw_post

      id = params[:id]
      username = serialize_request_body[UserConstants::USER_MAP_USERNAME_KEY]

      UserUseCases.update_user username, id

      render status: 200
    rescue StandardError
      render status: 404
    end
  end

  def delete_user
    begin
      id = params[:id]

      UserUseCases.delete_user id

      render status: 204
    rescue StandardError
      render status: 404
    end
  end
end
