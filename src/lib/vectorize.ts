import { openai } from './openai'

export const vectorize = async (input: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    input,
    model: 'text-embedding-ada-002',
  })

  const vector = response.data[0].embedding
  return vector
}
