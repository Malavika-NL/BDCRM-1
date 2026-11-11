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
  // This machine exposes the NexusOne container on 7005 for the .94 LAN
  // address.  Port 7000 is used by the .56 deployment.  Sending .94 users
  // to 7000 reaches no portal and can leave them with a code from a different
  // SSO instance.
  if (hostname === '192.168.1.94') {
    return `${protocol}//${hostname}:7005/login`;
  }
  // NexusOne is served separately from BDCRM.  The CRM may be reached through
  // a tunnel on another port, so do not inherit the BDCRM port here.
  const portalOrigin = import.meta.env.VITE_NEXUSONE_URL || `${protocol}//${hostname}:7005`;
  return `${portalOrigin.replace(/\/$/, '')}/login`;
};
