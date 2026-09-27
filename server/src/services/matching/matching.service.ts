import { calculateCompatibility, CompatibilityValidationError } from '../compatibility/compatibility.engine.js';
import type { StudentRepository } from '../../repositories/student.repository.js';
import type { RankedMatch } from '../../types/compatibility.types.js';
import { AppError } from '../../middleware/error.middleware.js';

export function matchLabel(score: number): string {
  if (score >= 90) return 'Excellent Match';
  if (score >= 75) return 'Strong Match';
  if (score >= 60) return 'Good Match';
  return 'Low Compatibility';
}

export class MatchingService {
  constructor(private readonly students: StudentRepository) {}

  async findMatches(studentId: string): Promise<RankedMatch[]> {
    const [student, candidates] = await Promise.all([
      this.students.findById(studentId),
      this.students.findAll(),
    ]);
    if (!student) throw new AppError(404, 'Student not found');

    return candidates
      .filter((candidate) => candidate.id !== student.id)
      .map((candidate) => {
        try {
          const result = calculateCompatibility(student.lifestyle, candidate.lifestyle);
          return {
            studentId: candidate.id,
            name: candidate.name,
            compatibilityScore: result.overallScore,
            label: matchLabel(result.overallScore),
            overallScore: result.overallScore,
            components: result.components,
            strengths: result.strengths,
            differences: result.differences,
            explanation: result.explanation,
          };
        } catch (error) {
          if (error instanceof CompatibilityValidationError) throw new AppError(400, error.message);
          throw error;
        }
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore || a.name.localeCompare(b.name));
  }
}