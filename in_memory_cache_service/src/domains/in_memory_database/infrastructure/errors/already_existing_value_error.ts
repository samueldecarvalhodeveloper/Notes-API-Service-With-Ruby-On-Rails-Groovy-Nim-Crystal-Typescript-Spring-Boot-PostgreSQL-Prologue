import {
  ALREADY_EXISTING_VALUE_ERROR_MESSAGE,
  ALREADY_EXISTING_VALUE_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";

class AlreadyExistingValueError implements Error {
  name = ALREADY_EXISTING_VALUE_ERROR_NAME;
  message = ALREADY_EXISTING_VALUE_ERROR_MESSAGE;
}

export default AlreadyExistingValueError;
