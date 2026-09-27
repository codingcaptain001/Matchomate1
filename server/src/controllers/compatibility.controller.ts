import type { Request, Response, NextFunction } from 'express';
import type { StudentRepository } from '../repositories/student.repository.js';
import { CompatibilityService } from '../services/compatibility/compatibility.service.js';
import { AppError } from '../middleware/error.middleware.js';

export function createCompatibilityController(repository: StudentRepository) {
  const service = new CompatibilityService(repository);
  return {
    calculate: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { studentAId, studentBId } = request.body ?? {};
        if (typeof studentAId !== 'string' || !studentAId.trim()
          || typeof studentBId !== 'string' || !studentBId.trim()) {
          throw new AppError(400, 'studentAId and studentBId are required');
        }
        if (studentAId === studentBId) throw new AppError(400, 'A student cannot be matched with themselves');
        const { studentA, studentB, result } = await service.calculate(studentAId, studentBId);
        response.json({ success: true, data: { studentA, studentB, ...result } });
      } catch (error) {
        next(error);
      }
    },
    getPair: async (request: Request, response: Response, next: NextFunction) => {
      try {
        const { studentAId, studentBId } = request.params;
        if (typeof studentAId !== 'string' || typeof studentBId !== 'string') {
          throw new AppError(400, 'Student IDs must be strings');
        }
        const { studentA, studentB, result } = await service.calculate(studentAId, studentBId);
        response.json({ success: true, data: { studentA, studentB, ...result } });
      } catch (error) {
        next(error);
      }
    },
  };
}