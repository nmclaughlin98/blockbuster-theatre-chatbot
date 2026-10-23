# blockbuster-theatre-chatbot

An AWS CDK application in TypeScript that provisions an Amazon Lex V2 text chatbot and a Node.js 24 Lambda function for intent fulfillment.

Repository: https://github.com/nmclaughlin98/blockbuster-theatre-chatbot

## Requirements

- Node.js 24 or newer
- npm
- AWS credentials and a configured region to deploy
- AWS CDK bootstrapped in the target account and region

## Getting started

Install dependencies and compile the project:

```bash
npm ci
npm run build
```

Run the tests:

```bash
npm test
```

Synthesize the CloudFormation template without deploying:

```bash
npm run synth
```

Deploy the stack:

```bash
npx cdk bootstrap
npm run deploy
```

Review the synthesized template before deploying to an AWS account. The GitHub Actions deployment workflow is manual and expects an `AWS_DEPLOY_ROLE_ARN` repository secret configured for OIDC, plus an optional `AWS_REGION` repository variable.
The AWS deployment role is configured outside this repository; its policy should scope `iam:PassRole` to the Lex service role created by this stack, and its OIDC trust should be restricted to the intended GitHub repository and environment.

## Chatbot functionality

The `en_US` Lex locale includes these intents:

- `BrowseUpcomingShowings` — browse upcoming movies and showings.
- `FindShowtimesByMovie` — search by movie title (`MovieName`).
- `FindShowtimesByDate` — search by date (`ShowingDate`, `AMAZON.Date`).
- `FindShowtimesByTime` — search by time (`ShowingTime`, `AMAZON.Time`).
- `FindShowtimesByMovieAndDate` — search by movie and date.
- `FindShowtimesByMovieDateAndTime` — search by movie, date, and time.
- `ViewMyBookings` — reserved for future account-linked booking lookup; login and booking access are not implemented.
- `FallbackIntent` — handles requests outside the supported intents.

The fulfillment Lambda returns a Lex V2 response and acknowledges the requested search criteria. Live movie and showtime data are not yet connected to the theatre backend, so showtime intents currently return an explicit not-connected response. The login-dependent `ViewMyBookings` intent is also a placeholder.

## Website integration

The stack outputs the Lex bot ID, alias ID, alias ARN, and locale ID. A text client can send user messages to the Lex V2 `RecognizeText` runtime operation using the deployed alias. Do not put long-lived AWS credentials in browser code; connect the website through an authenticated backend/API or a suitably scoped identity role that permits only the required Lex runtime operation.

The Lex bot is configured as not child-directed (`childDirected: false`). Review and change this setting before deployment if the website is directed at children under 13 or is otherwise subject to COPPA.

The Lex service role trusts the Lex V2 service only when the request originates from this AWS account. Its CloudWatch Logs permissions are limited to log groups under `/aws/lex/`; it does not use an unverified AWS-managed Lex policy.

## Project layout

- `lib/stack/` — CDK app, stack configuration, and Lambda defaults
- `lib/lex/` — Lex V2 bot construct and intent/slot definitions
- `lib/interfaces/lex/` — shared Lex intent, slot, and Lambda interfaces
- `src/main/lambda/handlers/` — Lex fulfillment handler
- `src/test/` — handler and CDK infrastructure tests
- `.github/workflows/` — build and manual deployment workflows

## Extending this stack

Add or update individual `*Intent.ts` definitions in `lib/lex/intents/` and `*Slot.ts` definitions in `lib/lex/slots/`. Keep shared Lex interfaces in `lib/interfaces/lex/`, implement each intent as a class in its own `src/main/lambda/intent-handlers/` folder, and keep its response text in that folder's `messageTemplates.ts`. Add corresponding tests in `src/test/`. The future showtime integration belongs in the Lambda, where it can call the theatre backend without exposing backend credentials to the website.
