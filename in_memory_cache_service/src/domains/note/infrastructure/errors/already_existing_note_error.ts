import {
  ALREADY_EXISTING_NOTE_ERROR_NAME,
  ALREADY_EXISTING_NOTE_ERROR_MESSAGE,
} from "../../../../constants/domains/note_constants";

class AlreadyExistingNoteError {
  name = ALREADY_EXISTING_NOTE_ERROR_NAME;
  message = ALREADY_EXISTING_NOTE_ERROR_MESSAGE;
}

export default AlreadyExistingNoteError;
