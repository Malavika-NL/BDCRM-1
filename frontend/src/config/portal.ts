/** Keep CRM navigation on the active HTTPS or legacy LAN entry point. */
export const getCompanyPortalUrl = () => {
  const { protocol, hostname, port } = window.location;
  if (hostname === 'vbsagent.tail9c1eb6.ts.net' || hostname === '100.106.13.10' || ['6002', '6003', '6004'].includes(port)) {
    return 'https://vbsagent.tail9c1eb6.ts.net:6001';
  }
  return `${protocol}//${hostname}:8002`;
};

/** The central NexusOne workspace used after a CRM-only logout. */
export const getNexusOneLoginUrl = () => {
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:7000/login`;
};
