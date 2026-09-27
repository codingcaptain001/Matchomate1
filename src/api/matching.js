async function requestMatchingApi(path, options = {}) {
  const response = await fetch(`/api${path}`, options);
  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(body.error?.message || 'Unable to load roommate matches.');
  }
  return body.data ?? body;
}

export function getRoommateMatches(studentId, options) {
  return requestMatchingApi(`/matches/${encodeURIComponent(studentId)}`, options);
}

export function getMatchingStudents(options) {
  return requestMatchingApi('/students', options);
}

export function getCompatibility(studentAId, studentBId, options) {
  return requestMatchingApi(
    `/compatibility/${encodeURIComponent(studentAId)}/${encodeURIComponent(studentBId)}`,
    options,
  );
}