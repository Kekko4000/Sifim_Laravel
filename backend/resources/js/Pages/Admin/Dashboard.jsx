import { usePage } from '@inertiajs/react';

export default function Dashboard() {
  const { props: { locale } } = usePage();
  return (
    <div>
      <h1>DASHBOARD</h1>
    </div>
  );
}
