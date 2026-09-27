import cors from 'cors';
import express from 'express';
import type { StudentRepository } from './repositories/student.repository.js';
import { InMemoryStudentRepository } from './repositories/student.repository.js';
import { HostelStateRepository } from './repositories/hostel-state.repository.js';
import { toPublicStudent } from './services/compatibility/compatibility.service.js';
import { AppError, errorMiddleware } from './middleware/error.middleware.js';
import { compatibilityRoutes } from './routes/compatibility.routes.js';
import { matchingRoutes } from './routes/matching.routes.js';

export function createApp(
  studentRepository: StudentRepository = new InMemoryStudentRepository(),
  hostelState = new HostelStateRepository(),
) {
  const app = express();
  const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://localhost:5174')
    .split(',').map((origin) => origin.trim());

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  app.get('/api/students', async (_request, response, next) => {
    try {
      const students = await studentRepository.findAll();
      response.json({ success: true, data: students.map(toPublicStudent) });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/students/:id', async (request, response, next) => {
    try {
      const id = request.params.id;
      if (typeof id !== 'string') throw new AppError(400, 'Student ID must be a string');
      const student = await studentRepository.findById(id);
      if (!student) throw new AppError(404, 'Student not found');
      response.json({ success: true, data: toPublicStudent(student) });
    } catch (error) {
      next(error);
    }
  });

  app.use('/api/compatibility', compatibilityRoutes(studentRepository));
  app.use('/api/matches', matchingRoutes(studentRepository));

  app.get('/api/state', (_request, response) => response.json(hostelState.get()));
  app.put('/api/state', async (request, response, next) => {
    try {
      await hostelState.replace(request.body);
      response.json({ saved: true });
    } catch (error) {
      next(error);
    }
  });

  app.use((_request, _response, next) => next(new AppError(404, 'Not found')));
  app.use(errorMiddleware);
  return app;
}