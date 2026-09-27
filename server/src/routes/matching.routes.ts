import { Router } from 'express';
import type { StudentRepository } from '../repositories/student.repository.js';
import { createMatchingController } from '../controllers/matching.controller.js';

export function matchingRoutes(repository: StudentRepository): Router {
  const router = Router();
  const controller = createMatchingController(repository);
  router.get('/me', controller.getMe);
  router.get('/:studentId', controller.getMatches);
  return router;
}