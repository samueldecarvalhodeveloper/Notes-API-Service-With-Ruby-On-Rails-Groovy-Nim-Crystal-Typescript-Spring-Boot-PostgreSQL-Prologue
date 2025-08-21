require "grip"
require "../domains/request_redirector/request_redirector"
require "../constants/routes_constants"

class UserController < Grip::Controllers::Http
  def get_all_users(context : Context) : Context
    redirected_request_response =
      RequestRedirector.get_response_of_get_redirect(USER_ROUTE)

    context
      .put_status(redirected_request_response.status_code)
      .send_resp(redirected_request_response.body)
  end

  def get_user(context : Context) : Context
    route_parameters = context.fetch_path_params

    user_id = route_parameters[USER_ID_ROUTE_PARAMETER]

    redirected_request_response =
      RequestRedirector.get_response_of_get_redirect("#{USER_ROUTE}#{user_id}/")

    context
      .put_status(redirected_request_response.status_code)
      .send_resp(redirected_request_response.body)
  end

  def create_user(context : Context) : Context
    request_body = context.fetch_json_params.to_json

    redirected_request_response =
      RequestRedirector.get_response_of_post_redirect(USER_ROUTE, request_body)

    context
      .put_status(redirected_request_response.status_code)
      .send_resp(redirected_request_response.body)
  end

  def update_user(context : Context) : Context
    route_parameters = context.fetch_path_params

    user_id = route_parameters[USER_ID_ROUTE_PARAMETER]

    request_body = context.fetch_json_params.to_json

    redirected_request_response =
      RequestRedirector.get_response_of_patch_redirect("#{USER_ROUTE}#{user_id}/", request_body)

    context
      .put_status(redirected_request_response.status_code)
      .send_resp(redirected_request_response.body)
  end

  def delete_user(context : Context) : Context
    route_parameters = context.fetch_path_params

    user_id = route_parameters[USER_ID_ROUTE_PARAMETER]

    redirected_request_response =
      RequestRedirector.get_response_of_delete_redirect("#{USER_ROUTE}#{user_id}/")

    context
      .put_status(redirected_request_response.status_code)
      .send_resp(redirected_request_response.body)
  end
end
