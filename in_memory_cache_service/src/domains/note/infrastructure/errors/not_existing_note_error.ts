import {
  NOT_EXISTING_NOTE_ERROR_NAME,
  NOT_EXISTING_NOTE_ERROR_MESSAGE,
} from "../../../../constants/domains/note_constants";

class NotExistingNoteError {
  name = NOT_EXISTING_NOTE_ERROR_NAME;
  message = NOT_EXISTING_NOTE_ERROR_MESSAGE;
}

export default NotExistingNoteError;
