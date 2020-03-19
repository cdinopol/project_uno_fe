AUTHENTICATION FLOW
===================

1. check `localStorage(Google/iOS AccountManager)` for credentials: `username, password, server`
   1. if not exists, call `/api/auth/register`
   2. store credentials to `localStorage(Google/iOS AccountManager)`
2. Login `/api/auth/login` using stored `username`, `password`, `server`
3. Store `access` and `refresh` token
4. Do silent `/api/autht/refresh` using `refresh` token to refresh `access` token every n minutes
5. Use `access` to call game functions `api/game/**`
