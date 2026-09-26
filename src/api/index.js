// ============================================================
// MATCHOMATE — API Abstraction Layer
// Clean interface for future FastAPI backend integration
// Currently returns mock data; swap implementations to connect live API
// ============================================================

import * as mock from '../data/mockData';

// Simulate async API call
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// ---- Hostel ----
export async function getHostels() {
  await delay();
  return mock.hostels;
}

export async function getCurrentHostel() {
  await delay();
  return mock.currentHostel;
}

// ---- Dashboard ----
export async function getKPIData() {
  await delay();
  return mock.kpiData;
}

export async function getAIAttentionItems() {
  await delay();
  return mock.aiAttentionItems;
}

export async function getHostelHealth() {
  await delay();
  return mock.hostelHealth;
}

export async function getOccupancyData() {
  await delay();
  return mock.occupancyData;
}

export async function getComplaintData() {
  await delay();
  return mock.complaintData;
}

export async function getRoommateIntelligence() {
  await delay();
  return mock.roommateIntelligence;
}

export async function getRecentActivity() {
  await delay();
  return mock.recentActivity;
}

// ---- Students ----
export async function getStudents() {
  await delay();
  return mock.students;
}

export async function getStudentById(id) {
  await delay();
  return mock.students.find(s => s.id === id) || null;
}

export async function getStudentProfile() {
  await delay();
  return mock.studentProfile;
}

// ---- Rooms ----
export async function getRooms() {
  await delay();
  return mock.rooms;
}

export async function getRoomByNumber(number) {
  await delay();
  return mock.rooms.find(r => r.number === number) || null;
}

// ---- Complaints ----
export async function getComplaints() {
  await delay();
  return mock.complaints;
}

// ---- Announcements ----
export async function getAnnouncements() {
  await delay();
  return mock.announcements;
}

// ---- AI Matching ----
export async function getMatchingFactors() {
  await delay();
  return mock.matchingFactors;
}

// ---- Analytics ----
export async function getExperienceData() {
  await delay();
  return mock.experienceData;
}
