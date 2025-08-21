export enum ErrorMessages {
  INTERNAL_SERVER_ERROR = 'Iternal Server Error',
  INVALID_OR_EXPIRED_ACCESS_TOKEN = 'Invalid or expired access token',
  INVALID_OR_EXPIRED_REFRESH_TOKEN = 'Invalid or expired refresh token',
  MISSING_OR_INVALID_AUTH_HEADER = 'Authorization header missing or invalid',
  PASSWORDS_MUST_BE_THE_SAME = 'Password and repeated password must be the same',
  INVALID_USERNAME = 'Provided username is invalid',
  INVALID_PASSWORD = 'Provided password is invalid',
  REFRESH_TOKEN_NOT_PROVIDED = 'Refresh token did not provided',
  USER_NOT_FOUND = 'User does not exist',
  USERNAME_OR_EMAIL_NOT_ALLOWED = 'User with this username or email exists',
}
