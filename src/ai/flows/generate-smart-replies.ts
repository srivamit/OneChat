// src/ai/flows/generate-smart-replies.ts
'use server';

/**
 * @fileOverview Generates smart reply suggestions based on the latest message.
 *
 * - generateSmartReplies - A function that generates smart reply options.
 * - GenerateSmartRepliesInput - The input type for the generateSmartReplies function.
 * - GenerateSmartRepliesOutput - The return type for the generateSmartReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartRepliesInputSchema = z.object({
  message: z.string().describe('The latest message to generate smart replies for.'),
});
export type GenerateSmartRepliesInput = z.infer<typeof GenerateSmartRepliesInputSchema>;

const GenerateSmartRepliesOutputSchema = z.object({
  replies: z.array(z.string()).describe('An array of suggested reply options.'),
  shouldSuggest: z.boolean().describe('A boolean value indicating whether smart replies should be suggested based on the message content.')
});
export type GenerateSmartRepliesOutput = z.infer<typeof GenerateSmartRepliesOutputSchema>;

export async function generateSmartReplies(input: GenerateSmartRepliesInput): Promise<GenerateSmartRepliesOutput> {
  return generateSmartRepliesFlow(input);
}

const shouldSuggestRepliesTool = ai.defineTool({
  name: 'shouldSuggestReplies',
  description: 'Determines whether smart replies are appropriate for the given message.',
  inputSchema: z.object({
    message: z.string().describe('The message to evaluate.'),
  }),
  outputSchema: z.boolean(),
}, async (input) => {
  // Implement logic to determine if smart replies should be suggested
  // based on the message content.  For example, check if the message
  // is a question, or if it's a simple statement that could benefit
  // from quick replies.
  // This is a placeholder implementation - replace with actual logic.
  return input.message.length > 5;
});

const generateSmartRepliesPrompt = ai.definePrompt({
  name: 'generateSmartRepliesPrompt',
  input: {schema: GenerateSmartRepliesInputSchema},
  output: {schema: GenerateSmartRepliesOutputSchema},
  tools: [shouldSuggestRepliesTool],
  prompt: `You are a helpful assistant that generates smart reply suggestions for chat messages.

  Determine if you should suggest replies using the shouldSuggestReplies tool.

  Generate an array of 3-5 suggested reply options that are appropriate for the message.

  Message: {{{message}}}
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateSmartRepliesFlow = ai.defineFlow(
  {
    name: 'generateSmartRepliesFlow',
    inputSchema: GenerateSmartRepliesInputSchema,
    outputSchema: GenerateSmartRepliesOutputSchema,
  },
  async input => {
    const {output} = await generateSmartRepliesPrompt(input);
    return output!;
  }
);
