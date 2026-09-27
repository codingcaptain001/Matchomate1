const API_URL = import.meta.env.VITE_API_URL || '';

async function requestMatchingApi(path, options = {}) {
  const response = await fetch(`${API_URL}/api${path}`, options);

  const contentType = response.headers.get('content-type') || '';

  // Handle non-JSON responses such as Vercel's index.html
  if (!response.ok) {
    if (contentType.includes('application/json')) {
      const body = await response.json();
      throw new Error(
        body.error?.message || 'Unable to load roommate matches.'
      );
    }

    throw new Error(
      `Matching API request failed (${response.status}).`
    );
  }

  // Prevent "<!doctype html>" JSON parsing errors
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Matching API is unavailable. Please try again later.'
    );
  }

  const body = await response.json();

  if (body.success === false) {
    throw new Error(
      body.error?.message || 'Unable to load roommate matches.'
    );
  }

  return body.data ?? body;
}

export function getRoommateMatches(studentId, options) {
  return requestMatchingApi(
    `/matches/${encodeURIComponent(studentId)}`,
    options
  );
}

export function getMatchingStudents(options) {
  return requestMatchingApi('/students', options);
}

export function getCompatibility(studentAId, studentBId, options) {
  return requestMatchingApi(
    `/compatibility/${encodeURIComponent(studentAId)}/${encodeURIComponent(studentBId)}`,
    options
  );
}
