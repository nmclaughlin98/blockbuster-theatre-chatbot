export interface HelloEvent {
  name?: string;
}

export interface HelloResponse {
  message: string;
}

export const handler = async (event: HelloEvent = {}): Promise<HelloResponse> => {
  const name = event.name?.trim() || 'World';
  return { message: `Hello, ${name}!` };
};
