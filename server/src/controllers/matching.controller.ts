import type { Request, Response, NextFunction } from 'express';
import type { StudentRepository } from '../repositories/student.repository.js';
import { MatchingService } from '../services/matching/matching.service.js';

export function createMatchingController(repository: StudentRepository) {
  const service = new MatchingService(repository);
  const getMatches = async (studentId: string, response: Response, next: NextFunction) => {
    try {
      const matches = await service.findMatches(studentId);
      response.json({ success: true, data: { studentId, matches } });
    } catch (error) {
      next(error);
    }
  };
  return {
    getMatches: async (request: Request, response: Response, next: NextFunction) => {
      const studentId = request.params.studentId;
      if (typeof studentId !== 'string') {
        next(new Error('Student ID must be a string'));
        return;
      }
      await getMatches(studentId, response, next);
    },
    getMe: async (_request: Request, response: Response, next: NextFunction) => {
      await getMatches(process.env.DEMO_STUDENT_ID || 'STU001', response, next);
    },
  };
}