import {
  ALREADY_EXISTING_USER_ERROR_NAME,
  ALREADY_EXISTING_USER_ERROR_MESSAGE,
} from "../../../../constants/domains/user_constants";

class AlreadyExistingUserError implements Error {
  name = ALREADY_EXISTING_USER_ERROR_NAME;
  message = ALREADY_EXISTING_USER_ERROR_MESSAGE;
}

export default AlreadyExistingUserError;
