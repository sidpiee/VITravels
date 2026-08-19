import { cookies } from "next/headers";

export async function serverFetch(
  url: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieStore.toString(),
    },
  });
}