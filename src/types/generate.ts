import { GeneratedManga, MangaConfig } from '@/types';

export type GenerateConfig = MangaConfig;

/**
 * Request for a single manga page generation.
 */
export interface GenerateRequest {
  prompt: string;
  config: GenerateConfig;
  sessionHistory?: GeneratedManga[];
  isAutoContinue?: boolean;
  projectId?: string;
}

/**
 * Standard API response wrapper for generation.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  details?: string;
}

/**
 * Data returned from a single page generation.
 */
export interface GenerateResponseData {
  page: GeneratedManga;
  prompt: string;
  imageUrl: string;
}

export type GenerateResponse = ApiResponse<GenerateResponseData>;

/**
 * Request for batch manga generation.
 */
export interface BatchGenerateRequest {
  prompts: string[];
  config: GenerateConfig;
  projectId?: string;
  batchSize?: number;
}

/**
 * Status and results of a batch job.
 */
export interface BatchGenerateResponse {
  pages: GeneratedManga[];
  totalGenerated: number;
  totalRequested: number;
  batchId?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: {
    completed: number;
    total: number;
    failed: number;
  };
}

export type BatchGenerateResult = ApiResponse<BatchGenerateResponse>;

/**
 * History record for past generations.
 */
export interface GenerationHistory {
  id: string;
  type: 'single' | 'batch';
  prompt: string;
  parameters: GenerateConfig;
  imageUrls: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  metadata: {
    provider: string;
    processingTime?: number;
    cost?: number;
  };
}

// Dialogue bubble interface for adding to panels
export interface DialogueBubble {
  id?: string;
  /** X position as percentage (0-100) from left */
  x: number;
  /** Y position as percentage (0-100) from top */
  y: number;
  /** Dialogue text content */
  text: string;
  /** Bubble style */
  style?: 'speech' | 'thought' | 'shout' | 'whisper' | 'narrator';
  /** Tail direction pointing to speaker */
  tailDirection?: 'left' | 'right' | 'top' | 'bottom' | 'none';
  /** Font size (optional) */
  fontSize?: number;
  /** Character name (optional) */
  characterName?: string;
}

// AI-suggested dialogue
export interface DialogueSuggestion {
  text: string;
  characterName?: string;
  style: 'speech' | 'thought' | 'shout' | 'whisper' | 'narrator';
  suggestedX: number;
  suggestedY: number;
  reasoning: string;
}
