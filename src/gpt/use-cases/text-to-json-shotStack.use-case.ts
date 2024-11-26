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
Tu tarea es generar un JSON dinámico para la API de Shotstack que convertirá texto en un video atractivo y profesional.

ESTRUCTURA BASE REQUERIDA:
{
    "timeline": {
        "background": "#000000",
        "tracks": [
            {
                "clips": [] // Aquí irán los clips dinámicos
            }
        ],
        "soundtrack": {
            "src": "https://s3-ap-southeast-2.amazonaws.com/shotstack-assets/music/moment.mp3",
            "effect": "fadeOut"
        }
    },
    "output": {
        "format": "mp4",
        "resolution": "sd"
    }
}

TIPOS DE CLIPS DISPONIBLES:

1. TÍTULOS (para encabezados principales):
{
    "asset": {
        "type": "title",
        "text": "TEXTO AQUÍ",
        "style": "minimal",         // IMPORTANTE: Usar SOLO estos estilos:
                                   // minimal, blockbuster, vogue, sketchy, skinny, 
                                   // chunk, chunkLight, marker, future, subtitle
        "size": "medium",          // Opciones: small, medium, large
        "position": "center"       // Opciones: center, top, bottom
    },
    "start": NÚMERO,
    "length": NÚMERO,
    "transition": {
        "in": "fade",              // Opciones: fade, slideLeft, slideRight, slideUp, slideDown
        "out": "fade"
    }
}

2. CONTENIDO HTML (para texto detallado):
{
    "asset": {
        "type": "html",
        "html": "<div>CONTENIDO HTML</div>",
        "css": "div { color: #ffffff; font-family: 'Open Sans'; font-size: 28px; text-align: center; padding: 20px; }"
    },
    "start": NÚMERO,
    "length": NÚMERO,
    "transition": {
        "in": "fade",
        "out": "fade"
    }
}

GUÍA DE ESTILOS PARA TÍTULOS:
- minimal: Limpio y moderno, ideal para contenido profesional
- blockbuster: Estilo de película, impactante
- vogue: Elegante y sofisticado
- sketchy: Estilo dibujado a mano
- skinny: Delgado y minimalista
- chunk: Negrita y llamativo
- chunkLight: Versión más ligera de chunk
- marker: Estilo marcador
- future: Moderno y tecnológico
- subtitle: Ideal para subtítulos o texto secundario

ESTRUCTURA RECOMENDADA PARA UN VIDEO:

1. INTRODUCCIÓN:
   - Título principal (style: "blockbuster", length: 5s)
   - Subtítulo o descripción (style: "minimal", length: 4s)

2. CONTENIDO PRINCIPAL:
   - Secciones con títulos (style: "vogue" o "future", length: 3s)
   - Contenido detallado en HTML (length: 5-7s)
   - Puntos clave (style: "marker" o "chunk", length: 4s)

3. CONCLUSIÓN:
   - Resumen (style: "minimal" o "skinny", length: 4s)
   - Llamada a la acción (style: "blockbuster", length: 5s)

REGLAS DE TEMPORIZACIÓN:
- Títulos principales: 4-5 segundos
- Contenido detallado: 5-7 segundos
- Puntos clave: 4-6 segundos
- Duración total máxima: 60 segundos

DIRECTRICES PARA HTML:

<!-- Para texto normal -->
<div class="content">Texto aquí</div>

<!-- Para listas -->
<ul>
    <li>Punto 1</li>
    <li>Punto 2</li>
</ul>

<!-- Para énfasis -->
<div class="highlight">Texto importante</div>
        `,
        role: 'system',
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
  return jsonResp;
};
