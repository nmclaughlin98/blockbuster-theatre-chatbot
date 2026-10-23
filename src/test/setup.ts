import * as fs from 'fs';
import * as path from 'path';

const targetDir = path.resolve(
  __dirname,
  '../../app',
  `test-worker-${process.env.JEST_WORKER_ID || '1'}`
);

fs.mkdirSync(targetDir, { recursive: true });
process.env.CDK_OUTDIR = targetDir;
