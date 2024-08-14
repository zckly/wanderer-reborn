export const generateCanvasTitlePrompt = ({
  context,
  decision,
}: {
  context: string;
  decision: string;
}) => {
  return `Generate a title for this "life mapping canvas" based on the following initial content and decision.
<context>
${context}
</context>
<decision>
${decision}
</decision>
Make sure the title is highly relevant to the context and decision. Don't say anything about the title, just generate it. Do not include quotation marks in the title. Keep the title short - no more than 7 words.`;
};
