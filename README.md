# Node.js+Typescript+Express

This api is aimed to provide the backend support for budget buddy frontend
The user login, authentication and authorization are done via AWS cognito and userpoolID
user passwords are not kept in db but in AWS only
For authentication aws token is verified as per the cognito documentation available
Secret has is added to apis to provide additional security
All apis need token authentication other than login
Budget apis have sorting added to them for category field
Transaction api has sorting, searching and filters available as per documented

Api documentation is available at GET {api-url}/api-docs

Folder Structure

- src
  - config
  - controllers
  - db
    - models
    - seeders
  - dtos
  - lib
  - middlewares
    - validators
  - routes
  - services

External packages used

- @aws-sdk/client-cognito-identity-provider // for authentication and authorization
- cors
- dotenv
- express
- express-validator
- jsonwebtoken // decode token
- jwk-to-pem // cognito permissions handling
- mongoose
- node-fetch // get cognito permissions file
- swagger-jsdoc // api documentation
- swagger-ui-express // api documentation

ENV variables used

- PORT
- MONGO_URL

- AWS_REGION
- AWS_CLIENT_ID
- AWS_SECRET_ACCESS_KEY
- AWS_ACCESS_KEY_ID
- AWS_API_VERSION
- AWS_USER_POOL_ID
- AWS_CLIENT_SECRET

Additional Features that can be added

- Pre and Post hooks for models
- search indexes
- SES or SNS for otp or other information sharing
- S3 for document storage
- cron job for monthly budget reset
- CSRF token authentication for login api
