# TEMPLATE_REPO_NAME

A minimal AWS CDK application written in TypeScript. It deploys one Node.js 24 Lambda function and includes unit tests for both the handler and the synthesized infrastructure.

Repository: https://github.com/TEMPLATE_OWNER/TEMPLATE_REPO_NAME

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

## Example Lambda

The example handler returns a greeting, using `World` when no name is supplied. Invoke it with an event such as:

```json
{
  "name": "Ada"
}
```

## Project layout

- `lib/stack/` — CDK app and stack entry points
- `src/main/lambda/` — Lambda construct and handler
- `src/test/` — handler and CDK infrastructure tests
- `.github/workflows/` — build and manual deployment workflows

## Extending this stack

Add application-specific infrastructure in `lib/stack/`, runtime code in `src/main/lambda/handlers/`, and corresponding tests in `src/test/`.
