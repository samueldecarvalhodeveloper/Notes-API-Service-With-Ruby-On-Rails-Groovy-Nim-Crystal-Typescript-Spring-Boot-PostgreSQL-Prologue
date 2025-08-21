import {
  NOT_EXISTING_HASH_ERROR_MESSAGE,
  NOT_EXISTING_HASH_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";

class NotExistingHashError {
  name = NOT_EXISTING_HASH_ERROR_NAME;
  message = NOT_EXISTING_HASH_ERROR_MESSAGE;
}

export default NotExistingHashError;
