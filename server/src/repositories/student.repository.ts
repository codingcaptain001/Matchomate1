import { demoStudents } from '../data/students.js';
import type { Student } from '../types/student.types.js';

export interface StudentRepository {
  findAll(): Promise<Student[]>;
  findById(id: string): Promise<Student | undefined>;
}

export class InMemoryStudentRepository implements StudentRepository {
  constructor(private readonly students: Student[] = demoStudents) {}

  async findAll(): Promise<Student[]> {
    return this.students;
  }

  async findById(id: string): Promise<Student | undefined> {
    return this.students.find((student) => student.id === id);
  }
}