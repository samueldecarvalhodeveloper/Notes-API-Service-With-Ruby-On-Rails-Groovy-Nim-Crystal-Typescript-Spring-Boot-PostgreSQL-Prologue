import {
  NOT_EXISTING_VALUE_ERROR_MESSAGE,
  NOT_EXISTING_VALUE_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";

class NotExistingValueError {
  name = NOT_EXISTING_VALUE_ERROR_NAME;
  message = NOT_EXISTING_VALUE_ERROR_MESSAGE;
}

export default NotExistingValueError;
