type HeaderRequest = {
  req: {
    url: string;
    header: (name: string) => string | undefined;
  };
};

export function publicOrigin(c: HeaderRequest): string {
  const forwardedProto = c.req.header('x-forwarded-proto');
  const forwardedHost = c.req.header('x-forwarded-host') ?? c.req.header('host');
  if (forwardedHost) {
    const proto = forwardedProto ?? 'http';
    return `${proto}://${forwardedHost}`;
  }

  return new URL(c.req.url).origin;
}
