'use client';

import { SuntusButton } from '@suntus/ui';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">suntus-landing</h1>
        
        {/* Test: SuntusButton compartido desde @suntus/ui - Debe verse azul (bg-blue-500) */}
        <SuntusButton
          title="Botón Primary (Azul)"
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
