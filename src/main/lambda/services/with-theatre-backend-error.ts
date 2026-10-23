import { TheatreBackendError } from './theatre-backend-client';

export async function withTheatreBackendErrorPrompt(
  operation: () => Promise<string>,
  errorPrompt: string
): Promise<string> {
  try {

    return await operation();
  } catch (error: unknown) {
    if (!(error instanceof TheatreBackendError)) {
      throw error;
    }

    console.error('Theatre backend request failed.', { error: error.message });

    return errorPrompt;
  }
}
