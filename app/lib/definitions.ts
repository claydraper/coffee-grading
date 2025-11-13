export type Sample = {
  id: string;
  sampleId: string;
  origin: string;
  process: string;
  variety?: string;
  elevation?: number;
  roaster?: string;
  roastDate?: Date | string;
  roastLevel?: 'LIGHT' | 'MEDIUM' | 'MEDIUM_DARK' | 'DARK';
  roasterNotes?: string;
  
  // Physical Analysis
  primaryDefects?: number;
  secondaryDefects?: number;
  moisture?: number;
  density?: string;
  screenSize?: string;
  
  // Cupping Evaluation
  fragranceAroma?: number;
  dry?: number;
  breakScore?: number;
  flavor?: number;
  aftertaste?: number;
  acidity?: number;
  body?: number;
  uniformity?: number;
  balance?: number;
  cleanCup?: number;
  sweetness?: number;
  overall?: number;
  
  // Defects
  taint?: number;
  fault?: number;
  roastDefects?: string;
  
  // Calculated
  finalScore?: number;
  
  // Metadata
  notes?: string;
  userId: string;
  cuppingId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Cupping = {
  id: string;
  name: string;
  description?: string;
  date: Date | string;
  userId: string;
  samples: Sample[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type CuppingWithSamples = Cupping & {
  samples: Sample[];
};
