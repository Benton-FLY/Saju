import type { RelationshipReport, ShareSummary } from '../types/report';
import { readSharedResult as readLegacy } from './legacyShare';
export { copyUrl } from './legacyShare';
/** Construct a small public object; never serialize a Report directly. */
export function sharePayload(r: RelationshipReport): ShareSummary {
  return {
    version: 2,
    parent: { nickname: r.parent.nickname, role: r.parent.role },
    child: { nickname: r.child.nickname, role: r.child.role },
    title: r.archetype.copy.title,
    type: r.archetype.copy.type,
    trigger: r.triggers[0]?.copy.title ?? '',
    phrase: r.powerPhrase.copy.phrase,
  };
}
const clean = (r: ShareSummary): ShareSummary => ({
  version: 2,
  parent: { nickname: r.parent.nickname, role: r.parent.role },
  child: { nickname: r.child.nickname, role: r.child.role },
  title: r.title,
  type: r.type,
  trigger: r.trigger,
  phrase: r.phrase,
  ...(r.legacy ? { legacy: true } : {}),
});
export function createShareUrl(summary: ShareSummary, base = window.location.href) {
  const data = new TextEncoder().encode(JSON.stringify(clean(summary)));
  const token = btoa(String.fromCharCode(...data))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
  const url = new URL(base);
  url.search = '';
  url.hash = `report=${token}`;
  return url.href;
}
export function readSharedResult(hash: string): ShareSummary | null {
  if (hash.startsWith('#result=')) {
    const old = readLegacy(hash);
    return old
      ? {
          version: 2,
          parent: { nickname: old.parent.nickname, role: old.parent.role },
          child: { nickname: old.child.nickname, role: old.child.role },
          title: old.subtitle,
          type: old.title,
          trigger: '',
          phrase: old.tip,
          legacy: true,
        }
      : null;
  }
  if (!hash.startsWith('#report=') || hash.length > 6000) return null;
  try {
    const token = hash.slice(8);
    if (!/^[A-Za-z0-9_-]+$/.test(token)) return null;
    const r = JSON.parse(
      new TextDecoder('utf-8', { fatal: true }).decode(
        Uint8Array.from(atob(token.replaceAll('-', '+').replaceAll('_', '/')), (c) =>
          c.charCodeAt(0),
        ),
      ),
    ) as ShareSummary;
    const str = (v: unknown, max: number) =>
      typeof v === 'string' && v.trim().length > 0 && v.length <= max;
    if (
      r.version !== 2 ||
      !r.parent ||
      !r.child ||
      !str(r.parent.nickname, 12) ||
      !str(r.child.nickname, 12) ||
      !['엄마', '아빠'].includes(r.parent.role) ||
      !['딸', '아들'].includes(r.child.role) ||
      !str(r.title, 120) ||
      !str(r.type, 50) ||
      !(r.trigger === '' || str(r.trigger, 120)) ||
      !str(r.phrase, 300) ||
      (r.legacy !== undefined && typeof r.legacy !== 'boolean')
    )
      return null;
    return clean(r);
  } catch {
    return null;
  }
}
