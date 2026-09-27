import type { LifestyleProfile } from '../../types/student.types.js';
import type { CompatibilityComponents, CompatibilityResult } from '../../types/compatibility.types.js';

const weights = {
  sleep: 0.2,
  cleanliness: 0.15,
  study: 0.15,
  noise: 0.15,
  social: 0.1,
  guests: 0.05,
  food: 0.1,
  smoking: 0.1,
} satisfies Record<keyof CompatibilityComponents, number>;

const numericFields = [
  'cleanliness', 'noiseTolerance', 'studyHabits', 'socialLevel', 'guestFrequency', 'smokingPreference',
] as const;

const componentLabels: Record<keyof CompatibilityComponents, string> = {
  sleep: 'sleep schedules',
  cleanliness: 'cleanliness preferences',
  study: 'study habits',
  noise: 'noise preferences',
  social: 'social preferences',
  guests: 'guest preferences',
  food: 'food preferences',
  smoking: 'smoking preferences',
};

export class CompatibilityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompatibilityValidationError';
  }
}

export function calculateNumericSimilarity(a: number, b: number): number {
  if (![a, b].every((value) => Number.isFinite(value) && value >= 1 && value <= 5)) {
    throw new CompatibilityValidationError('Numeric lifestyle values must be between 1 and 5');
  }
  return 100 - (Math.abs(a - b) / 4) * 100;
}

function parseTime(value: string): number {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new CompatibilityValidationError('Time must use valid 24-hour HH:mm format');
  }
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function calculateTimeDifference(timeA: string, timeB: string): number {
  const difference = Math.abs(parseTime(timeA) - parseTime(timeB));
  return Math.min(difference, 1440 - difference);
}

function timeSimilarity(timeA: string, timeB: string): number {
  return 100 - (calculateTimeDifference(timeA, timeB) / 720) * 100;
}

function validateLifestyle(profile: LifestyleProfile): void {
  if (!profile || typeof profile !== 'object') throw new CompatibilityValidationError('Lifestyle profile is required');
  for (const field of numericFields) calculateNumericSimilarity(profile[field], profile[field]);
  if (typeof profile.foodPreference !== 'string' || !profile.foodPreference.trim()) {
    throw new CompatibilityValidationError('Food preference is required');
  }
  parseTime(profile.sleepTime);
  if (profile.wakeTime !== undefined) parseTime(profile.wakeTime);
}

function sleepScore(a: LifestyleProfile, b: LifestyleProfile): number {
  const sleep = timeSimilarity(a.sleepTime, b.sleepTime);
  if (!a.wakeTime || !b.wakeTime) return sleep;
  return (sleep + timeSimilarity(a.wakeTime, b.wakeTime)) / 2;
}

function makeExplanation(components: CompatibilityComponents): { strengths: string[]; differences: string[]; explanation: string } {
  const ranked = (Object.entries(components) as [keyof CompatibilityComponents, number][])
    .sort((a, b) => b[1] - a[1]);
  const strengths = ranked.filter(([, score]) => score >= 85).slice(0, 3)
    .map(([key]) => `Similar ${componentLabels[key]}`);
  const differences = ranked.filter(([, score]) => score < 75).slice(-3)
    .map(([key]) => `Different ${componentLabels[key]}`);

  const topAreas = ranked.slice(0, 3).map(([key]) => componentLabels[key]);
  const score = Math.round(Object.entries(components).reduce(
    (total, [key, value]) => total + value * weights[key as keyof CompatibilityComponents], 0,
  ));
  const level = score >= 90 ? 'excellent' : score >= 75 ? 'strong' : score >= 60 ? 'moderate' : 'limited';
  return {
    strengths,
    differences,
    explanation: `You have ${level} lifestyle compatibility, especially in ${topAreas.join(', ')}.`,
  };
}

export function calculateCompatibility(a: LifestyleProfile, b: LifestyleProfile): CompatibilityResult {
  validateLifestyle(a);
  validateLifestyle(b);
  const rawComponents: CompatibilityComponents = {
    sleep: sleepScore(a, b),
    cleanliness: calculateNumericSimilarity(a.cleanliness, b.cleanliness),
    study: calculateNumericSimilarity(a.studyHabits, b.studyHabits),
    noise: calculateNumericSimilarity(a.noiseTolerance, b.noiseTolerance),
    social: calculateNumericSimilarity(a.socialLevel, b.socialLevel),
    guests: calculateNumericSimilarity(a.guestFrequency, b.guestFrequency),
    food: a.foodPreference.trim().toLowerCase() === b.foodPreference.trim().toLowerCase() ? 100 : 0,
    smoking: calculateNumericSimilarity(a.smokingPreference, b.smokingPreference),
  };
  const overallScore = Math.round(Object.entries(rawComponents).reduce(
    (total, [key, value]) => total + value * weights[key as keyof CompatibilityComponents], 0,
  ));
  const components: CompatibilityComponents = {
    sleep: Math.round(rawComponents.sleep),
    cleanliness: Math.round(rawComponents.cleanliness),
    study: Math.round(rawComponents.study),
    noise: Math.round(rawComponents.noise),
    social: Math.round(rawComponents.social),
    guests: Math.round(rawComponents.guests),
    food: Math.round(rawComponents.food),
    smoking: Math.round(rawComponents.smoking),
  };
  const generated = makeExplanation(components);
  return { overallScore, components, ...generated };
}