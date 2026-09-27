import dotenv from 'dotenv';
import { createApp } from './app.js';
import { HostelStateRepository } from './repositories/hostel-state.repository.js';

dotenv.config();

const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const hostelState = new HostelStateRepository();
await hostelState.initialize();

const app = createApp(undefined, hostelState);
app.listen(port, '0.0.0.0', () => {
  console.log(`MatchoMate API listening on port ${port}`);
});
