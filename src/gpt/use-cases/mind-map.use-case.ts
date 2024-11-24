import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const mindMapUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Te serán proveidos textos que pueden estár en diverson idiomas.
          Debes generar un mapa mental con ese texto y retornar el código en mermaidJs.
          Para generar un mapa mental, como mínimo es necesario contar con: 
          - Un párrafo qeu sesuma la idea principal y algunas ideas derivadas.
          _ Al menos 3 ideas o puntos clave.
          - Entre otros.
          Si no se cumple lo necesario para generar un mapa mental, debes retornar
          la palabra 'Error'. Y si cumple con los requisitos, debes retornar el código.
          
          Ejemplo de salida en tipo JSON (respentando saltos de línea):
          {
            "mindMap": string // Código en mermaidJs | 'Error'
          }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4o',
    temperature: 0.3,
    response_format: {
      type: 'json_object',
    },
  });

  const jsonResp = JSON.parse(completion.choices[0].message.content);
  const mindMapFormatted = jsonResp.mindMap.replace(/\\n/g, '\n');
  return mindMapFormatted;
};

