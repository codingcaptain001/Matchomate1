import { Router } from 'express';
import type { StudentRepository } from '../repositories/student.repository.js';
import { createCompatibilityController } from '../controllers/compatibility.controller.js';

export function compatibilityRoutes(repository: StudentRepository): Router {
  const router = Router();
  const controller = createCompatibilityController(repository);
  router.post('/calculate', controller.calculate);
  router.get('/:studentAId/:studentBId', controller.getPair);
  return router;
}