'use client';

import { SuntusButton, ThemeToggle, useSuntusTheme } from '@suntus/ui';

export default function Home() {
  const { isDark } = useSuntusTheme();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      {/* Toggle de tema en la esquina superior */}
      <div className="absolute top-8 right-8 z-10">
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-foreground">suntus-core</h1>
        
        {/* Test: SuntusButton compartido desde @suntus/ui - Debe verse verde menta (#18CB96) */}
        <SuntusButton
          title="Botón Primary (Verde Menta)"
          onPress={() => alert('SuntusButton Primary funciona!')}
          variant="primary"
        />
        <SuntusButton
          title="Botón Secondary"
          onPress={() => alert('SuntusButton Secondary funciona!')}
          variant="secondary"
        />
        <SuntusButton
          title="Botón Outline"
          onPress={() => alert('SuntusButton Outline funciona!')}
          variant="outline"
        />
      </div>
    </div>
  );
}
