export interface RoomAnalysis {
  roomType: string;
  clutterLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  summary: string;
  actionableSteps: ActionStep[];
  storageSolutions: ProductSuggestion[];
  motivationalQuote: string;
}

export interface ActionStep {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedTimeMinutes: number;
}

export interface ProductSuggestion {
  item: string;
  usage: string;
  category: 'Furniture' | 'Organizer' | 'Decor' | 'Other';
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
