import { getCompatibility } from './matching';

export async function generateAllocations({ students, rooms, targetBlocks, priority }) {
  if (students.length < 1) {
    throw new Error('Select at least one student.');
  }

  // 1. Calculate available capacity correctly
  const movingOutByRoom = new Map();
  students.forEach((student) => {
    if (student.room) movingOutByRoom.set(student.room, (movingOutByRoom.get(student.room) || 0) + 1);
  });

  const availableRooms = rooms
    .filter((room) => room.status !== 'maintenance' && (!targetBlocks.length || targetBlocks.includes(room.block)))
    .map((room) => ({
      room,
      freeBeds: room.capacity - Math.max(0, room.occupied - (movingOutByRoom.get(room.number) || 0)),
    }))
    .filter((room) => room.freeBeds > 0)
    .sort((a, b) => b.freeBeds - a.freeBeds || a.room.number.localeCompare(b.room.number));

  const totalFreeBeds = availableRooms.reduce((sum, r) => sum + r.freeBeds, 0);

  if (totalFreeBeds < students.length) {
    throw new Error(`${students.length} students selected, ${totalFreeBeds} beds available in the selected blocks.`);
  }

  const pairsToScore = [];
  for (let first = 0; first < students.length; first += 1) {
    for (let second = first + 1; second < students.length; second += 1) {
      pairsToScore.push([students[first], students[second]]);
    }
  }

  const scoredPairs = await Promise.all(pairsToScore.map(async ([studentA, studentB]) => {
    const result = await getCompatibility(studentA.id, studentB.id);
    return {
      students: [studentA, studentB],
      score: result.overallScore,
      strengths: result.strengths,
      differences: result.differences,
      sameCourse: studentA.course === studentB.course,
    };
  }));

  const sortedPairs = scoredPairs.sort((a, b) => {
    if (priority === 'course' && a.sameCourse !== b.sameCourse) return a.sameCourse ? -1 : 1;
    return b.score - a.score;
  });

  const allocations = [];
  const unpaired = new Set(students.map((student) => student.id));

  for (const candidate of availableRooms) {
    if (unpaired.size === 0) break;

    const allocatedToRoom = [];
    let roomScore = 0;
    let roomStrengths = [];
    let roomDifferences = [];

    // Try to add pairs if freeBeds >= 2
    while (candidate.freeBeds >= 2 && unpaired.size >= 2) {
      const bestPair = sortedPairs.find(({ students: [studentA, studentB] }) => unpaired.has(studentA.id) && unpaired.has(studentB.id));
      if (bestPair) {
        allocatedToRoom.push(...bestPair.students);
        bestPair.students.forEach((s) => unpaired.delete(s.id));
        candidate.freeBeds -= 2;
        roomScore = bestPair.score;
        roomStrengths = bestPair.strengths;
        roomDifferences = bestPair.differences;
      } else {
        break; // No more valid pairs
      }
    }

    // Add singles if freeBeds >= 1
    while (candidate.freeBeds >= 1 && unpaired.size > 0) {
      const studentId = Array.from(unpaired)[0];
      const student = students.find((s) => s.id === studentId);
      allocatedToRoom.push(student);
      unpaired.delete(studentId);
      candidate.freeBeds -= 1;
    }

    if (allocatedToRoom.length > 0) {
      allocations.push({
        id: `allocation-${allocatedToRoom.map((s) => s.id).sort().join('-')}`,
        room: candidate.room.number,
        students: allocatedToRoom,
        score: allocatedToRoom.length > 1 ? roomScore : 100,
        strengths: roomStrengths,
        differences: roomDifferences,
        risk: allocatedToRoom.length > 1 ? (roomScore >= 75 ? 'low' : 'high') : 'low',
      });
    }
  }

  const averageCompatibility = allocations.length > 0
    ? Math.round(allocations.reduce((total, allocation) => total + allocation.score, 0) / allocations.length)
    : 0;

  return { allocations, averageCompatibility };
}