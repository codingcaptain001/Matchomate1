export interface CompatibilityComponents {
  sleep: number;
  cleanliness: number;
  study: number;
  noise: number;
  social: number;
  guests: number;
  food: number;
  smoking: number;
}

export interface CompatibilityResult {
  overallScore: number;
  components: CompatibilityComponents;
  strengths: string[];
  differences: string[];
  explanation: string;
}

export interface RankedMatch extends CompatibilityResult {
  studentId: string;
  name: string;
  compatibilityScore: number;
  label: string;
}