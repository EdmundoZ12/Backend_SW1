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

${images.length > 0 ? `
IMPORTANTE: Se han proporcionado las siguientes URLs de imágenes que servirán como fondos para los clips del video:
${images.map((url, index) => `${index + 1}. ${url}`).join('\n')}

Debes analizar cada imagen proporcionada para determinar el mejor color de texto que contraste con ella. El video debe estructurarse en tracks superpuestos, donde:

1. Track inferior (índice mayor) para imágenes de fondo:
{
    "clips": [
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
    ]
}

2. Track superior (índice menor) para texto:
{
    "clips": [
        {
            "asset": {
                "type": "title",
                "text": "Texto del título",
                "style": "minimal",
                "size": "medium"
            },
            "start": 0,
            "length": 5
        }
        // O usando HTML para contenido más complejo
        {
            "asset": {
                "type": "html",
                "html": "<div>Contenido HTML</div>",
                "css": "div { color: COLOR_BASADO_EN_IMAGEN; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }",
                "width": 800,
                "height": 200
            },
            "start": 5,
            "length": 5
        }
    ]
}
` : ''}

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

ASSETS DISPONIBLES:

Para títulos:
{
    "asset": {
        "type": "title",
        "text": "Texto del título",
        "style": "minimal",
        "size": "medium"
    },
    "start": 0,
    "length": 5
}

Estilos disponibles: minimal, blockbuster, vogue, sketchy, skinny, chunk, chunkLight, marker, future, subtitle
Tamaños disponibles: small, medium, large

Para contenido HTML:
{
    "asset": {
        "type": "html",
        "html": "<p style='text-align: center;'>Contenido HTML</p>",
        "css": "p { color: #ffffff; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }",
        "width": 800,
        "height": 200
    },
    "start": 5,
    "length": 5
}

Para imágenes de fondo:
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

ESTRUCTURA DE VIDEO RECOMENDADA:

1. INTRODUCCIÓN (5-7 segundos):
   - Track inferior: Primera imagen de fondo
   - Track superior: Títulos principales

2. CONTENIDO (20-30 segundos por sección):
   - Track inferior: Rotar imágenes de fondo
   - Track superior: Contenido HTML o títulos según necesidad

3. CONCLUSIÓN (5-7 segundos):
   - Track inferior: Última imagen de fondo
   - Track superior: Mensaje de conclusión

REGLAS IMPORTANTES:
- Los clips en diferentes tracks deben estar perfectamente sincronizados en tiempo
- Las imágenes deben cubrir toda la pantalla usando fit: "cover"
- El texto debe ser legible contra el fondo usando colores apropiados
- Usar text-shadow cuando sea necesario para mejorar legibilidad

TIMING:
- Títulos: 4-5 segundos
- Contenido detallado: 5-7 segundos
- Transiciones suaves
- Los tiempos de inicio y duración deben coincidir entre tracks

Genera un JSON válido para la API de Shotstack, siguiendo la estructura de tracks múltiples y asegurando que el contenido esté correctamente sincronizado.
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
