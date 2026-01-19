import { GoogleGenAI } from "@google/genai";
import { MANGA_SYSTEM_INSTRUCTION, LAYOUT_PROMPTS } from "@/lib/constants";
import { MangaConfig, GeneratedManga } from "@/lib/types";

export const generateMangaImage = async (
  prompt: string,
  config: MangaConfig,
  sessionHistory?: GeneratedManga[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'AIzaSyDFbFT3W4yQ_Ad8I1CLz80otq7uJ7gf4_4' });
  
  // Build context and continuity instructions
  let continuityInstructions = '';
  if (config.context) {
    continuityInstructions += `\nCONTEXT & WORLD SETTING:\n${config.context}\n`;
  }
  
  if (sessionHistory && sessionHistory.length > 0) {
    continuityInstructions += `\nCONTINUITY REQUIREMENTS (Maintain consistency with previous pages in this session):\n`;
    continuityInstructions += `- Character designs, appearances, and clothing must match previous pages exactly\n`;
    continuityInstructions += `- Art style, inking technique, and visual tone must remain consistent\n`;
    continuityInstructions += `- Setting and environment details should continue from previous pages\n`;
    continuityInstructions += `- Previous story moments: ${sessionHistory.slice(-3).map(p => p.prompt).join(' | ')}\n`;
  }
  
  // Dialogue instructions
  let dialogueInstructions = '';
  if (config.dialogueDensity && config.dialogueDensity !== 'No Dialogue') {
    dialogueInstructions = `\nDIALOGUE REQUIREMENTS:\n`;
    dialogueInstructions += `- Include ${config.dialogueDensity.toLowerCase()} in the panels\n`;
    if (config.language) {
      dialogueInstructions += `- All text and dialogue should be in ${config.language}\n`;
      if (config.language === 'Japanese') {
        dialogueInstructions += `- Use Japanese characters (hiragana, katakana, kanji) for dialogue\n`;
      }
    }
    dialogueInstructions += `- Add speech bubbles and text naturally integrated into the composition\n`;
  } else {
    dialogueInstructions = `\n- NO DIALOGUE OR TEXT: This is a silent/visual-only page.\n`;
  }
  
  const enhancedPrompt = `
    TASK: Illustrate a high-end MANGA PAGE.
    - STORY CONTENT: ${prompt}
    - ART STYLE: ${config.style}
    - INKING TECHNIQUE: ${config.inking}
    - SCREENTONE DENSITY: ${config.screentone}
    - LAYOUT TYPE: ${config.layout} (${LAYOUT_PROMPTS[config.layout] || config.layout})
    - COLOR MODE: ${config.useColor ? 'Full Color Anime Style' : 'Traditional Black and White Ink'}
    ${continuityInstructions}
    ${dialogueInstructions}
    
    CRITICAL LAYOUT INSTRUCTIONS:
    - Avoid rigid grids. Use "Organic Paneling" with hand-drawn borders and varied line weights.
    - If multi-panel, ensure all frames are contained in ONE high-resolution image.
    - Apply the requested ${config.inking} style consistently.
    ${config.screentone !== 'None' ? `- Emphasize ${config.screentone} for shadows and textures.` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        systemInstruction: MANGA_SYSTEM_INSTRUCTION,
        imageConfig: {
          aspectRatio: config.aspectRatio as any
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Error generating manga image:", error);
    throw error;
  }
};
