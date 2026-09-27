import { calculateCompatibility, CompatibilityValidationError } from './compatibility.engine.js';
import type { StudentRepository } from '../../repositories/student.repository.js';
import type { CompatibilityResult } from '../../types/compatibility.types.js';
import type { PublicStudent, Student } from '../../types/student.types.js';
import { AppError } from '../../middleware/error.middleware.js';

export function toPublicStudent(student: Student): PublicStudent {
  const { id, name, course, branch, year, room, hostel } = student;
  return { id, name, course, branch, year, room, hostel };
}

export class CompatibilityService {
  constructor(private readonly students: StudentRepository) {}

  async calculate(studentAId: string, studentBId: string): Promise<{
    studentA: PublicStudent;
    studentB: PublicStudent;
    result: CompatibilityResult;
  }> {
    if (studentAId === studentBId) throw new AppError(400, 'A student cannot be matched with themselves');
    const [studentA, studentB] = await Promise.all([
      this.students.findById(studentAId),
      this.students.findById(studentBId),
    ]);
    if (!studentA || !studentB) throw new AppError(404, 'Student not found');
    try {
      return {
        studentA: toPublicStudent(studentA),
        studentB: toPublicStudent(studentB),
        result: calculateCompatibility(studentA.lifestyle, studentB.lifestyle),
      };
    } catch (error) {
      if (error instanceof CompatibilityValidationError) throw new AppError(400, error.message);
      throw error;
    }
  }
}