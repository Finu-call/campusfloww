// FRONTEND DEMO ONLY
// Passwords stored in localStorage are not secure.
// Replace this authentication system with real server-side
// authentication before production deployment.

export const initialUsers = [
    {
        id: "host-001",
        name: "CampusFlow Host",
        email: "host@campusflow.local",
        password: "admin123",
        role: "host",
        status: "active"
    },
    {
        id: "student-001",
        name: "Rahul Kumar",
        email: "rahul@example.com",
        password: "student123",
        role: "student",
        studentId: "EEE2026001",
        classroom: "S3-EEE",
        status: "active"
    },
    {
        id: "student-002",
        name: "Anu Joseph",
        email: "anu@example.com",
        password: "student123",
        role: "student",
        studentId: "EEE2026002",
        classroom: "S3-EEE",
        status: "active"
    },
    {
        id: "student-003",
        name: "Adarsh",
        email: "adarsh@example.com",
        password: "student123",
        role: "student",
        studentId: "EEE2026003",
        classroom: "S3-EEE",
        status: "active"
    },
    {
        id: "student-004",
        name: "Finu Fayad",
        email: "finu@example.com",
        password: "student123",
        role: "student",
        studentId: "EEE2026004",
        classroom: "S3-EEE",
        status: "active"
    }
];

export const initialResources = [
    { id: "res-1", title: "Network Theorems Notes", subject: "Circuit & Network", type: "PDF", uploadedBy: "Anu Joseph", uploaderId: "student-002", date: "20 minutes ago", size: "2.4 MB", category: "Notes" },
    { id: "res-2", title: "Analog Electronics Module 2", subject: "Analog Electronics", type: "Document", uploadedBy: "Finu Fayad", uploaderId: "student-004", date: "Yesterday", size: "1.8 MB", category: "Notes" }
];

export const initialAssignments = [
    { id: "ass-1", title: "Circuit & Network Assignment 2", subject: "Circuit & Network", dueDate: "24 September 2026", status: "Not Started", description: "Complete questions 1–10" }
];

export const initialAnnouncements = [
    { id: "ann-1", title: "Internal Examination", content: "Internal examination begins Monday...", postedBy: "CampusFlow Host", date: "2 hours ago" }
];

export const initialActivity = [
    { id: "act-1", action: "Rahul uploaded Network Theorems Notes", time: "15:32" },
    { id: "act-2", action: "Anu joined the classroom", time: "15:12" },
    { id: "act-3", action: "Host posted an announcement", time: "14:45" },
    { id: "act-4", action: "Adarsh uploaded Lab Record", time: "13:30" }
];
