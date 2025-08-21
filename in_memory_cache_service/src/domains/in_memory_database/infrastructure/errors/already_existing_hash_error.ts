import {
  ALREADY_EXISTING_HASH_ERROR_MESSAGE,
  ALREADY_EXISTING_HASH_ERROR_NAME,
} from "../../../../constants/domains/in_memory_database_constants";

class AlreadyExistingHashError implements Error {
  name = ALREADY_EXISTING_HASH_ERROR_NAME;
  message = ALREADY_EXISTING_HASH_ERROR_MESSAGE;
}

export default AlreadyExistingHashError;
