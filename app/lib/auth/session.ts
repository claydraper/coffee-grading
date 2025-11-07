export const SESSION_COOKIE_NAME = 'session_token';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  expires: Date;
}
