import { getCompatibility } from './matching';

export async function generateAllocations({ students, rooms, targetBlocks, priority }) {
  if (students.length < 2 || students.length % 2 !== 0) {
    throw new Error('Select an even number of students so everyone can be paired.');
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

  const unpaired = new Set(students.map((student) => student.id));
  const pairs = [];
  while (unpaired.size > 0) {
    const bestPair = scoredPairs
      .filter(({ students: [studentA, studentB] }) => unpaired.has(studentA.id) && unpaired.has(studentB.id))
      .sort((a, b) => {
        if (priority === 'course' && a.sameCourse !== b.sameCourse) return a.sameCourse ? -1 : 1;
        return b.score - a.score;
      })[0];
    if (!bestPair) throw new Error('Could not pair all selected students.');
    pairs.push(bestPair);
    bestPair.students.forEach((student) => unpaired.delete(student.id));
  }

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
    .sort((a, b) => b.freeBeds - a.freeBeds || a.room.number.localeCompare(b.room.number));

  const allocations = pairs
    .sort((a, b) => b.score - a.score)
    .map((pair) => {
      const room = availableRooms.find((candidate) => candidate.freeBeds >= 2);
      if (!room) throw new Error('Not enough available room capacity for the selected students and blocks.');
      room.freeBeds -= 2;
      return {
        id: `allocation-${pair.students.map((student) => student.id).sort().join('-')}`,
        room: room.room.number,
        students: pair.students,
        score: pair.score,
        strengths: pair.strengths,
        differences: pair.differences,
        risk: pair.score >= 75 ? 'low' : 'high',
      };
    });

  const averageCompatibility = Math.round(
    allocations.reduce((total, allocation) => total + allocation.score, 0) / allocations.length,
  );
  return { allocations, averageCompatibility };
}