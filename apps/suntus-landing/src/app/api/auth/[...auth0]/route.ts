// NOTA: Auth0 no es compatible con static export (output: "export")
// Las rutas de API dinámicas no funcionan en static export de Next.js
// 
// Para habilitar Auth0:
// 1. Remover "output: 'export'" de next.config.ts
// 2. Descomentar el código siguiente

export const dynamic = 'force-static';
export const revalidate = false;

// import { handleAuth } from '@auth0/nextjs-auth0';
//
// export const GET = handleAuth({
//   login: {
//     authorizationParams: {
//       audience: process.env.AUTH0_AUDIENCE!,
//       scope: 'openid profile email',
//     },
//     returnTo: '/',
//   },
//   callback: {
//     afterCallback: async (req, res, session) => {
//       if (session?.user) {
//         try {
//           const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
//           await fetch(`${apiUrl}/auth/callback`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//               token: session.idToken || session.accessToken 
//             }),
//           });
//         } catch (error) {
//           console.error('Error syncing user with backend:', error);
//         }
//       }
//       return session;
//     },
//   },
//   logout: {
//     returnTo: '/',
//   },
// });

// Placeholder para que la ruta exista (aunque no funcione en static export)
export async function GET() {
  return new Response('Auth0 routes require server-side rendering. Remove "output: export" from next.config.ts', {
    status: 501,
  });
}
