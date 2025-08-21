import {
  NOT_EXISTING_USER_ERROR_NAME,
  NOT_EXISTING_USER_ERROR_MESSAGE,
} from "../../../../constants/domains/user_constants";

class NotExistingUserError {
  name = NOT_EXISTING_USER_ERROR_NAME;
  message = NOT_EXISTING_USER_ERROR_MESSAGE;
}

export default NotExistingUserError;
