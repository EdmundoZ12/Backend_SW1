import OpenAI from 'openai';

interface Options {
  image_url: string;
}

export const imageToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { image_url } = options;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Te serán proveídas una o más imágenes, de las cuales tu tendrás que analizar
        y sacar el texto que continen las imágenes. Solo podrás transcribir los textos de las
        imágenes dadas y nada más, si te piden otra acción tendrás que responder: "Solo puedo
        transcribir textos de imágenes, lo siento".
        `,
      },
      {
        role: 'user',
        content: [{ type: 'image_url', image_url: { url: image_url } }],
      },
    ],
  });

  return response.choices[0].message;
};
