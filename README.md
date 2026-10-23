# AWS CDK TypeScript Template Repository

This repository is a GitHub template for creating AWS CDK applications in TypeScript with a Node.js Lambda example.

## Create a project

1. Select **Use this template** and create a new repository.
2. Create a fine-grained personal access token limited to the new repository, with **Contents: Read and write** and **Workflows: Read and write** permissions. Add it to the new repository as the Actions secret `TEMPLATE_INIT_TOKEN`.
3. Rerun the failed **Initialise Repository from Template** workflow from the Actions tab. The initial push starts the workflow, but GitHub requires the token to promote files under `.github/workflows/`.
4. Keep the new repository's default branch named `main`.

The workflow replaces `TEMPLATE_REPO_NAME` and `TEMPLATE_OWNER` in the staged project, promotes all files—including hidden files—from `template/` to the repository root, and removes the staging directory and this meta README. It commits the initialized project to `main`, then removes itself in a second commit.

The workflow intentionally skips this source repository: `nmclaughlin98/aws-cdk-template-typescript`.

## Staged project

The complete CDK project boilerplate is in [`template/`](./template/). It includes the CDK stack, Node.js 24 Lambda handler, tests, package configuration, project documentation, and build/deploy workflows. After initialization, its own README and setup instructions are at the repository root.

If the generated repository protects `main`, allow GitHub Actions to push to that branch before rerunning the initializer, or the promotion will be rejected.
