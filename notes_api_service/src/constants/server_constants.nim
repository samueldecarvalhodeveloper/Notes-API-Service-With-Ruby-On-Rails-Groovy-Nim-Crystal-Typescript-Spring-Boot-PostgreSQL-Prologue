import strutils
import prologue
import os

const SERVER_PORT* = parseInt(getEnv("PORT")).Port

const MESSAGE_QUEUE_SERVICE_URL* = getEnv("MESSAGE_QUEUE_SERVICE_URL")

const OK_STATUS_CODE* = 200

const CREATED_STATUS_CODE* = 201

const NOT_FOUND_STATUS_CODE* = 404

const NO_CONTENT_STATUS_CODE* = 204

const CONFLICT_STATUS_CODE* = 409

const JSON_MESSAGE_KEY* = "message"

const NOT_FOUND_ERROR_MESSAGE* = "Not Found!"

const SERVER_HOST* = "http://localhost:" & SERVER_PORT.repr()
