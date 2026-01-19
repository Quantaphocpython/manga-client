import { GoogleGenAI } from "@google/genai";
import { MANGA_SYSTEM_INSTRUCTION, LAYOUT_PROMPTS } from "@/lib/constants";
import { MangaConfig, GeneratedManga } from "@/lib/types";

export const generateMangaImage = async (
  prompt: string,
  config: MangaConfig,
  sessionHistory?: GeneratedManga[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'AIzaSyDFbFT3W4yQ_Ad8I1CLz80otq7uJ7gf4_4' });
  
  let continuityInstructions = '';
  
  if (config.context && config.context.trim()) {
    continuityInstructions += `\n═══════════════════════════════════════════════════════════\n`;
    continuityInstructions += `🌍 WORLD SETTING & CHARACTER PROFILES (MUST FOLLOW EXACTLY):\n`;
    continuityInstructions += `═══════════════════════════════════════════════════════════\n`;
    continuityInstructions += `${config.context}\n`;
    continuityInstructions += `\n⚠️ CRITICAL: All characters described above MUST maintain their EXACT appearance, features, clothing, and visual traits throughout this entire session!\n`;
  }
  
  if (sessionHistory && sessionHistory.length > 0) {
    continuityInstructions += `\n═══════════════════════════════════════════════════════════\n`;
    continuityInstructions += `📖 STORY CONTINUITY (This is page ${sessionHistory.length + 1} of an ongoing story):\n`;
    continuityInstructions += `═══════════════════════════════════════════════════════════\n`;
    
    const recentPages = sessionHistory.slice(-3);
    recentPages.forEach((page, idx) => {
      continuityInstructions += `\nPage ${sessionHistory.length - recentPages.length + idx + 1}: "${page.prompt}"\n`;
    });
    
    continuityInstructions += `\n🎯 CONSISTENCY REQUIREMENTS:\n`;
    continuityInstructions += `✓ Characters MUST look IDENTICAL to previous pages (same face, hair, eyes, body, clothes)\n`;
    continuityInstructions += `✓ Maintain the SAME art style, line weight, and visual aesthetic\n`;
    continuityInstructions += `✓ Continue the same ${config.style} style and ${config.inking} inking technique\n`;
    continuityInstructions += `✓ Keep the same level of detail and drawing quality\n`;
    continuityInstructions += `✓ If characters wore specific outfits before, they MUST wear the same unless story requires change\n`;
    continuityInstructions += `✓ Background and setting should match the established world\n`;
  }
  
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
╔═══════════════════════════════════════════════════════════════════╗
║                    MANGA PAGE GENERATION REQUEST                   ║
╚═══════════════════════════════════════════════════════════════════╝

📝 CURRENT SCENE TO ILLUSTRATE:
${prompt}

🎨 TECHNICAL SPECIFICATIONS:
• Art Style: ${config.style}
• Inking Technique: ${config.inking}
• Screentone Density: ${config.screentone}
• Panel Layout: ${config.layout} (${LAYOUT_PROMPTS[config.layout] || config.layout})
• Color Mode: ${config.useColor ? 'Full Color Manga/Anime Style' : 'Traditional Black and White Manga Ink'}

${continuityInstructions}

${dialogueInstructions}

📐 COMPOSITION & LAYOUT RULES:
✓ Create ONE cohesive manga page (not separate images)
✓ Use organic, hand-drawn panel borders with varied line weights
✓ Apply dynamic angles and perspectives for visual impact
✓ Ensure all panels fit within a single high-resolution image
✓ Use authentic manga visual language (speed lines, impact frames, etc.)
${config.screentone !== 'None' ? `✓ Apply ${config.screentone.toLowerCase()} screentone for depth and atmosphere` : ''}

${sessionHistory && sessionHistory.length > 0 ? `
⚠️ FINAL REMINDER: This page is part of an ongoing story. Characters MUST look exactly the same as in previous pages. Check character descriptions and previous scenes carefully before drawing!
` : ''}
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
