import { splitLexMessages } from '../../main/lambda/services/split-lex-messages';

describe('splitLexMessages', () => {
  it('splits long text into bounded Lex messages', () => {
    const message = `${'a'.repeat(3_500)}\n${'b'.repeat(3_500)}`;

    const messages = splitLexMessages(message);

    expect(messages).toHaveLength(2);
    expect(messages.every((part) => part.length <= 4_000)).toBe(true);
  });

  it('limits output to five messages and explains when results are omitted', () => {
    const message = Array.from({ length: 8 }, (_, index) =>
      `${index}:${'x'.repeat(3_999)}`
    ).join('\n');

    const messages = splitLexMessages(message);

    expect(messages).toHaveLength(5);
    expect(messages.every((part) => part.length <= 4_000)).toBe(true);
    expect(messages[4]).toContain('Additional results were omitted.');
  });
});
