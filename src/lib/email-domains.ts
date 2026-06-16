// Verified sender domains available for the email channel.
// These are the workspace's confirmed email domains.
export const EMAIL_DOMAINS: string[] = ["isura.tech"];

// A few common sender local-parts to offer as quick picks.
export const SENDER_PRESETS: string[] = ["briefings", "notify", "digest", "hello"];

export function buildSenderAddress(localPart: string, domain: string): string {
  return `${localPart.trim().toLowerCase()}@${domain}`;
}

const LOCAL_PART_RE = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i;

export function isValidLocalPart(localPart: string): boolean {
  const v = localPart.trim();
  return v.length > 0 && v.length <= 64 && LOCAL_PART_RE.test(v);
}
