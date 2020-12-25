import { Draqula } from 'draqula';

export const isServer = typeof window === 'undefined';

export function getDraqulaClientForToken(token: string) {
  return new Draqula(process.env.NEXT_PUBLIC_DB_URL, {
    hooks: {
      beforeRequest: [
        (rq) => rq.headers.set('Authorization', `Bearer ${token}`),
      ],
    },
  });
}
