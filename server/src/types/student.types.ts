export interface LifestyleProfile {
  sleepTime: string;
  wakeTime?: string;
  cleanliness: number;
  noiseTolerance: number;
  studyHabits: number;
  socialLevel: number;
  guestFrequency: number;
  foodPreference: string;
  smokingPreference: number;
}

export interface Student {
  id: string;
  name: string;
  course: string;
  branch: string;
  year: number;
  room: string;
  hostel: string;
  lifestyle: LifestyleProfile;
}

export type PublicStudent = Pick<Student, 'id' | 'name' | 'course' | 'branch' | 'year' | 'room' | 'hostel'>;