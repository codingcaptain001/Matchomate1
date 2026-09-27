import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCompatibility, calculateNumericSimilarity, calculateTimeDifference } from './compatibility.engine.js';
import { CompatibilityService } from './compatibility.service.js';
import { matchLabel, MatchingService } from '../matching/matching.service.js';
import { demoStudents } from '../../data/students.js';
import { InMemoryStudentRepository } from '../../repositories/student.repository.js';
import type { LifestyleProfile, Student } from '../../types/student.types.js';

const balanced: LifestyleProfile = {
  sleepTime: '23:00', wakeTime: '07:00', cleanliness: 5, noiseTolerance: 3,
  studyHabits: 4, socialLevel: 3, guestFrequency: 2, foodPreference: 'vegetarian', smokingPreference: 5,
};
const allFive: LifestyleProfile = {
  sleepTime: '23:00', wakeTime: '07:00', cleanliness: 5, noiseTolerance: 5,
  studyHabits: 5, socialLevel: 5, guestFrequency: 5, foodPreference: 'vegetarian', smokingPreference: 5,
};

test('numeric similarity maps 1–5 differences to the required scores', () => {
  assert.equal(calculateNumericSimilarity(5, 5), 100);
  assert.equal(calculateNumericSimilarity(4, 5), 75);
  assert.equal(calculateNumericSimilarity(3, 5), 50);
  assert.equal(calculateNumericSimilarity(2, 5), 25);
  assert.equal(calculateNumericSimilarity(1, 5), 0);
});

test('sleep time uses circular midnight distance', () => {
  assert.equal(calculateTimeDifference('23:30', '00:30'), 60);
});

test('identical profiles score 100 in every component', () => {
  const result = calculateCompatibility(balanced, { ...balanced });
  assert.equal(result.overallScore, 100);
  assert.ok(Object.values(result.components).every((score) => score === 100));
  assert.ok(result.strengths.length > 0);
});

test('opposite profiles score zero and food preference affects its component', () => {
  const opposite: LifestyleProfile = {
    sleepTime: '11:00', wakeTime: '19:00', cleanliness: 1, noiseTolerance: 1,
    studyHabits: 1, socialLevel: 1, guestFrequency: 1, foodPreference: 'non-vegetarian', smokingPreference: 1,
  };
  const result = calculateCompatibility(allFive, opposite);
  assert.equal(result.overallScore, 0);
  assert.equal(result.components.food, 0);
  assert.ok(result.differences.length > 0);
  assert.match(result.explanation, /limited lifestyle compatibility/);
  assert.equal(calculateCompatibility(balanced, { ...balanced, foodPreference: 'VEGETARIAN' }).components.food, 100);
  assert.equal(calculateCompatibility(balanced, { ...balanced, foodPreference: 'vegan' }).components.food, 0);
});

test('mixed profiles produce component-derived explanations and a weighted score', () => {
  const other = { ...balanced, sleepTime: '00:00', cleanliness: 3, foodPreference: 'vegan' };
  const result = calculateCompatibility(balanced, other);
  assert.equal(result.components.cleanliness, 50);
  assert.equal(result.components.food, 0);
  assert.equal(result.overallScore, 82);
  assert.ok(result.overallScore > 0 && result.overallScore < 100);
  assert.ok(result.differences.includes('Different cleanliness preferences'));
  assert.match(result.explanation, /study habits, noise preferences, social preferences/);
});

test('invalid numeric values and times are rejected', () => {
  assert.throws(() => calculateNumericSimilarity(0, 5), /between 1 and 5/);
  assert.throws(() => calculateCompatibility({ ...balanced, cleanliness: 6 }, balanced), /between 1 and 5/);
  assert.throws(() => calculateCompatibility({ ...balanced, sleepTime: '25:90' }, balanced), /HH:mm/);
});

test('same-student compatibility is rejected', async () => {
  const service = new CompatibilityService(new InMemoryStudentRepository());
  await assert.rejects(service.calculate('STU001', 'STU001'), /cannot be matched with themselves/);
});

test('matches are calculated and sorted in descending score order', async () => {
  const service = new MatchingService(new InMemoryStudentRepository());
  const matches = await service.findMatches('STU001');
  assert.equal(matches.length, demoStudents.length - 1);
  assert.ok(matches.every((match, index) => index === 0 || matches[index - 1].compatibilityScore >= match.compatibilityScore));
  assert.equal(matches[0].studentId, 'STU003');
  assert.equal(matches[0].name, 'Aman Kumar');
});

test('presentation labels follow the specified compatibility thresholds', () => {
  assert.equal(matchLabel(90), 'Excellent Match');
  assert.equal(matchLabel(89), 'Strong Match');
  assert.equal(matchLabel(75), 'Strong Match');
  assert.equal(matchLabel(74), 'Good Match');
  assert.equal(matchLabel(60), 'Good Match');
  assert.equal(matchLabel(59), 'Low Compatibility');
});

test('every eligible student has a valid matching profile', () => {
  for (const student of demoStudents as Student[]) {
    assert.doesNotThrow(() => calculateCompatibility(student.lifestyle, balanced));
  }
});