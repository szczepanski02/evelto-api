# Local sign in strategy:

- email, password
- create accessToken with 15m expiration time, and refreshToken with no expiration time
- if user got more then 2 tokens in database, first token is removed and the next one is adding at sing in
- if user wont login and he have already refreshToken in cookies, old token is removing from database and on his place is putting a new token
- if user got unauthorizated error and he already have refreshToken in cookies, frontend automaticly create api call to /refresh and returning new accessToken and new refreshToken
