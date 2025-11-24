import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Panel principal de administración',
};

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard de Administración</h1>
      <p>Bienvenido al panel de administración de suntUS</p>
    </div>
  );
}

