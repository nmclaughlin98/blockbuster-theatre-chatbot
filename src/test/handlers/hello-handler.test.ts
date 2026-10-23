import { handler } from '../../main/lambda/handlers/hello-handler';

describe('Hello Lambda handler', () => {
  it('returns a greeting for the supplied name', async () => {
    await expect(handler({ name: 'Ada' })).resolves.toEqual({
      message: 'Hello, Ada!',
    });
  });

  it('uses World when no name is supplied', async () => {
    await expect(handler({})).resolves.toEqual({
      message: 'Hello, World!',
    });
  });

  it('uses World when the supplied name is blank', async () => {
    await expect(handler({ name: '  ' })).resolves.toEqual({
      message: 'Hello, World!',
    });
  });
});
