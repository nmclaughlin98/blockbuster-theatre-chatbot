const MAX_MESSAGE_LENGTH = 4_000;
const MAX_MESSAGE_COUNT = 5;
const TRUNCATION_NOTICE =
  'Additional results were omitted. Please narrow your search.';

export function splitLexMessages(message: string): readonly string[] {
  const chunks: string[] = [];
  let current = '';

  for (const line of message.split('\n')) {
    let remaining = line;

    while (remaining.length > MAX_MESSAGE_LENGTH) {
      if (current) {
        chunks.push(current);
        current = '';
      }

      chunks.push(remaining.slice(0, MAX_MESSAGE_LENGTH));
      remaining = remaining.slice(MAX_MESSAGE_LENGTH);
    }

    const candidate = current ? `${current}\n${remaining}` : remaining;

    if (candidate.length > MAX_MESSAGE_LENGTH) {
      chunks.push(current);
      current = remaining;
    } else {
      current = candidate;
    }
  }

  if (current) {
    chunks.push(current);
  }

  if (chunks.length <= MAX_MESSAGE_COUNT) {

    return chunks;
  }

  const retained = chunks.slice(0, MAX_MESSAGE_COUNT - 1);
  const lastChunk = chunks[MAX_MESSAGE_COUNT - 1];
  const allowedLength = MAX_MESSAGE_LENGTH - TRUNCATION_NOTICE.length - 1;

  retained.push(`${lastChunk.slice(0, allowedLength)}\n${TRUNCATION_NOTICE}`);

  return retained;
}
