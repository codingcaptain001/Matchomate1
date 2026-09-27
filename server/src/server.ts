import dotenv from 'dotenv';
import { createApp } from './app.js';
import { HostelStateRepository } from './repositories/hostel-state.repository.js';

dotenv.config();

const port = Number(process.env.API_PORT || 3001);
const hostelState = new HostelStateRepository();
await hostelState.initialize();

const app = createApp(undefined, hostelState);
app.listen(port, '127.0.0.1', () => {
  console.log(`MatchoMate API listening on http://127.0.0.1:${port}`);
});