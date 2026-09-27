import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as seed from '../../../src/data/mockData.js';
import { AppError } from '../middleware/error.middleware.js';

export type HostelState = Record<string, unknown[]>;

const collectionNames = [
  'students', 'rooms', 'complaints', 'attendance', 'payments', 'leaveRequests',
  'maintenance', 'visitors', 'messMenu', 'messSkips', 'messFeedback',
  'announcements', 'recentActivity', 'movements',
];
const dataDirectory = path.resolve('server/data');
const stateFile = path.join(dataDirectory, 'state.json');

function initialState(): HostelState {
  return {
    students: seed.students,
    rooms: seed.rooms,
    complaints: seed.complaints,
    attendance: seed.attendanceRecords,
    payments: seed.payments,
    leaveRequests: seed.leaveRequests,
    maintenance: seed.maintenanceTasks,
    visitors: seed.visitors,
    messMenu: seed.messMenu,
    messSkips: seed.messSkips,
    messFeedback: seed.messFeedback,
    announcements: seed.announcements,
    recentActivity: seed.recentActivity,
    movements: [
      { id: 'm-2', studentId: 'STU001', type: 'IN', time: '06:18 PM', date: seed.HOSTEL_TODAY, location: 'Block B Main Gate (Biometric)' },
      { id: 'm-1', studentId: 'STU001', type: 'OUT', time: '08:42 AM', date: seed.HOSTEL_TODAY, location: 'Campus Library Gate' },
    ],
  };
}

function validState(value: unknown): value is HostelState {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && collectionNames.every((name) => Array.isArray((value as Record<string, unknown>)[name]));
}

export class HostelStateRepository {
  private state: HostelState = initialState();
  private writeQueue: Promise<void> = Promise.resolve();

  async initialize(): Promise<void> {
    await mkdir(dataDirectory, { recursive: true });
    try {
      const saved: unknown = JSON.parse(await readFile(stateFile, 'utf8'));
      if (!validState(saved)) throw new Error('Saved operations state has an invalid format');
      this.state = saved;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      await writeFile(stateFile, JSON.stringify(this.state, null, 2));
    }
  }

  get(): HostelState {
    return this.state;
  }

  async replace(value: unknown): Promise<void> {
    if (!validState(value)) throw new AppError(400, 'State must include an array for every collection');
    const nextState = value;
    this.writeQueue = this.writeQueue.catch(() => {}).then(async () => {
      const temporaryFile = `${stateFile}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(temporaryFile, JSON.stringify(nextState, null, 2));
      await rename(temporaryFile, stateFile);
      this.state = nextState;
    });
    await this.writeQueue;
  }
}