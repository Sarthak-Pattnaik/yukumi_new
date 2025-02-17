// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard/app');  // Redirects users to the /dashboard page
}
