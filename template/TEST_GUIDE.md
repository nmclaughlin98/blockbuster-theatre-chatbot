# Test Guide

Run the full Jest suite with:

```bash
npm test
```

The suite contains:

- Handler unit tests in `src/test/handlers/`
- CDK template assertions in `src/test/lib/`

Generate a coverage report with:

```bash
npm run test:coverage
```

Type-check and compile the TypeScript separately with:

```bash
npm run build
```

The CDK tests bundle the Lambda with esbuild and write synthesized test output under the ignored `app/` directory.
