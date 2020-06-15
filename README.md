# Serverless Portfolio Management Application

Serverless portfolio management application where a user can track and maintain their portfolio.


## Functionality of the application

- [x] **A user needs to authenticate in order to use an application home**
- [x] **The application allows users to create and delete portfolio items.**
- [x] **The application only displays items for a logged in user.**



The application consists of a frontend and backend.

### Frontend

The `client` folder contains a web application that can use the API developed in the project.
This frontend works with the serverless application.

### Backend
The `backend` folder contains a serverless application that uses the [serverless framework](https://github.com/serverless)

- The code is split into multiple layers separating business logic from I/O related code.
- Code is implemented using async/await and Promises without using callbacks.

#### Authentication

Authentication in this application, is done through [Auth0](https://auth0.com/), Which uses asymmetrically encrypted JWT tokens.

- https://auth0.com/blog/navigating-rs256-and-jwks/


## Usage

### The Backend

#### Development

**Dependency Installation**

The Serverless Framework will need us to configure access to AWS. This can be accomplished by running

`serverless config credentials --provider aws --key KEY --secret SECRET`

>Where KEY and SECRET are our AWS Key and secret key. We are not deploying to AWS, but the serverless plugin needs this configuration to exist in order to work correctly.

```bash
npm install -g serverless
```

### The Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```bash
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless application.

## Best practices applied


- All resources in the application are defined in the serverless.yml file.
- Each function has its own set of permissions.
- Application has sufficient monitoring.
- HTTP requests are validated.
