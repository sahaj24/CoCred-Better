"use client";

// Reuse the existing AuthorityDashboard component but render under /dashboard/faculty
// so faculty users have a clean URL.
import AuthorityDashboard from "../authority/page";

export default function FacultyDashboardPage() {
  return <AuthorityDashboard />;
}
