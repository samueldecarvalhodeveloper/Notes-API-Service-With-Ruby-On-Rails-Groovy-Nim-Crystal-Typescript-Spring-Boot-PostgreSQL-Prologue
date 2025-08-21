export function NOTE_IN_MEMORY_DATABASE_KEY(userId: number): string {
  return `user:${userId}:notes`;
}

export function NOTE_HASH_IN_MEMORY_DATABASE_KEY(noteId: number): string {
  return `note:${noteId}`;
}

export const NOT_EXISTING_NOTE_ERROR_NAME = "Note Does Not Exist Error";

export const NOT_EXISTING_NOTE_ERROR_MESSAGE = "Note Does Not Exist";

export const ALREADY_EXISTING_NOTE_ERROR_NAME = "Note Already Exists Error";

export const ALREADY_EXISTING_NOTE_ERROR_MESSAGE = "Note Already Exists";

export const NOTE_ID_IN_MEMORY_DATABASE_KEY = "id";

export const NOTE_TITLE_IN_MEMORY_DATABASE_KEY = "title";

export const NOTE_BODY_IN_MEMORY_DATABASE_KEY = "body";

export const NOTE_CREATED_AT_IN_MEMORY_DATABASE_KEY = "created_at";

export const NOTE_UPDATED_AT_IN_MEMORY_DATABASE_KEY = "updated_at";

export const NOTE_USER_ID_IN_MEMORY_DATABASE_KEY = "user_id";

export const NOTE_ID = 1;

export const NOTE_TITLE = "Title";

export const NOTE_BODY = "Body";

export const NOTE_CREATED_AT = 0;

export const NOTE_UPDATED_AT = 0;
