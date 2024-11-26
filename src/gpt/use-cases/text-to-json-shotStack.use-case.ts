import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const textToJsonShotStackUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        content: `
Tu tarea es analizar texto educativo y generar un JSON dinámico para la API de Shotstack que convertirá el contenido en un video atractivo y profesional.
ESTRUCTURA BASE:
{
"timeline": {
"soundtrack": {
"src": "https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/moment.mp3",
"effect": "fadeOut"
},
"background": "#000000",
"tracks": [
{
"clips": []
}
]
},
"output": {
"format": "mp4",
"resolution": "hd"
}
}
TIPOS DE ASSETS DISPONIBLES:

TITLE ASSET (para textos con estilos predefinidos):

jsonCopy{
    "asset": {
        "type": "title",
        "text": "Texto del título",
        "style": "minimal",
        "size": "medium",
        "position": "center"
    },
    "start": 0,
    "length": 5,
    "transition": {
        "in": "fade",
        "out": "fade"
    }
}
Estilos disponibles para title:

minimal
blockbuster
vogue
sketchy
skinny
chunk
chunkLight
marker
future
subtitle

Tamaños disponibles:

small
medium
large

Posiciones disponibles:

center
top
bottom


HTML ASSET (para contenido con formato):

jsonCopy{
    "asset": {
        "type": "html",
        "html": "<p style='text-align: center;'>Texto con formato HTML</p>",
        "css": "p { font-family: 'Open Sans'; color: #ffffff; font-size: 28px; }",
        "width": 800,
        "height": 200
    },
    "start": 5,
    "length": 5,
    "transition": {
        "in": "fade",
        "out": "fade"
    }
}
RECURSOS VERIFICADOS:

MÚSICA DE FONDO:


"https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/moment.mp3"
"https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/disco.mp3"
"https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/dreams.mp3"

ESTRUCTURA RECOMENDADA PARA VIDEOS EDUCATIVOS:

INTRODUCCIÓN (5-7 segundos):

Title Asset con estilo "blockbuster" para título principal
Title Asset con estilo "minimal" para subtítulo


CONTENIDO (20-30 segundos por sección):

Title Asset con estilo "future" para encabezados de sección
HTML Asset para contenido detallado y listas


CONCLUSIÓN (5-7 segundos):

Title Asset con estilo "marker" para llamada a la acción



REGLAS Y CONSEJOS:

TIMING:


Títulos: 4-5 segundos
Contenido detallado: 5-7 segundos
Usar transiciones suaves (fade, slideLeft, slideRight)


DISEÑO:


Mantener textos centrados para mejor legibilidad
Usar HTML para listas y contenido detallado
Mantener consistencia en tamaños y estilos


COLORES:


Usar fondo oscuro (#000000 o #111111)
Texto claro para mejor contraste (#ffffff)
Mantener una paleta consistente
Tienes que generar un JSON válido para usar la API de Shotstack.

        `,
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
