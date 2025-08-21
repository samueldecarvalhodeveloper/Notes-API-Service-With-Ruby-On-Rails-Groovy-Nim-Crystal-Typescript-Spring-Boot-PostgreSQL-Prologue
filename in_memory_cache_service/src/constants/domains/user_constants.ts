export const USER_IN_MEMORY_DATABASE_KEY = "users";

export function USER_HASH_IN_MEMORY_DATABASE_KEY(id: number): string {
  return `user:${id}`;
}

export const NOT_EXISTING_USER_ERROR_NAME = "User Does Not Exist Error";

export const NOT_EXISTING_USER_ERROR_MESSAGE = "User Does Not Exist";

export const ALREADY_EXISTING_USER_ERROR_NAME = "User Already Exists Error";

export const ALREADY_EXISTING_USER_ERROR_MESSAGE = "User Already Exists";

export const USER_ID_IN_MEMORY_DATABASE_KEY = "id";

export const USER_USERNAME_IN_MEMORY_DATABASE_KEY = "username";

export const USER_ID = 0;

export const USER_USERNAME = "Samuel de Carvalho";
