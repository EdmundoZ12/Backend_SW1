import OpenAI from 'openai';

interface Options {
  prompt: string;
  images?: string[];
}

export const textToJsonShotStackUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, images = [] } = options;

  const systemPrompt = `
Tu tarea es analizar texto educativo y generar un JSON dinámico para la API de Shotstack que convertirá el contenido en un video atractivo y profesional.

IMPORTANTE - REGLAS DE TEXTO:
Para incluir texto con formato correcto, debes usar títulos con type: "title" y el siguiente formato:

{
    "asset": {
        "type": "title",
        "text": "Texto del contenido",
        "style": "chunk",
        "size": "medium",
        "position": "bottom",
        "background": "#000000"
    },
    "start": 0,
    "length": 5
}

${
  images.length > 0
    ? `
IMPORTANTE - ESTRUCTURA DE CLIPS:
Se han proporcionado las siguientes URLs de imágenes que servirán como fondos:
${images.map((url, index) => `${index + 1}. ${url}`).join('\n')}
`
    : ''
}

ESTRUCTURA BASE:
{
    "timeline": {
        "soundtrack": {
            "src": "https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/moment.mp3",
            "effect": "fadeOut"
        },
        "tracks": [
            {
                "clips": []  // Track para texto (superior)
            },
            {
                "clips": []  // Track para imágenes de fondo (inferior)
            }
        ]
    },
    "output": {
        "format": "mp4",
        "size": {
            "width": 1280,
            "height": 720
        }
    }
}

ESTRUCTURA DE CLIPS:

1. Para texto (usar SIEMPRE este formato):
{
    "asset": {
        "type": "title",
        "text": "Texto del contenido",
        "style": "chunk",
        "size": "medium",
        "position": "bottom",
        "background": "#000000"
    },
    "start": 0,
    "length": 5
}

2. Para imágenes de fondo:
{
    "asset": {
        "type": "image",
        "src": "URL_DE_LA_IMAGEN"
    },
    "start": 0,
    "length": 5,
    "fit": "cover",
    "scale": 1
}

TIMING Y ESTRUCTURA:

1. INTRODUCCIÓN (5-7 segundos):
   - Track inferior: Primera imagen de fondo
   - Track superior: Título principal

2. CONTENIDO (5-7 segundos por sección):
   - Track inferior: Rotar imágenes de fondo
   - Track superior: Texto dividido en secciones manejables

3. CONCLUSIÓN (5-7 segundos):
   - Track inferior: Última imagen de fondo
   - Track superior: Mensaje final

REGLAS CRÍTICAS:
- SIEMPRE usar type: "title" para el texto
- SIEMPRE usar style: "chunk" para consistencia
- SIEMPRE usar position: "bottom"
- SIEMPRE usar background: "#000000"
- SIEMPRE mantener el texto conciso y legible
- Dividir el texto en segmentos cortos y manejables
- No exceder 2-3 líneas de texto por segmento

Debes generar un JSON válido para la API de Shotstack que mantenga esta estructura consistente en todo el video.
`;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        content: systemPrompt,
        role: 'system',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4o',
    response_format: {
      type: 'json_object',
    },
  });

  const jsonResp = JSON.parse(completion.choices[0].message.content);
  return jsonResp;
};
