import type { DisplayPerson, MetricKey, Result } from '../types';
import { elements, zodiac } from '../data/zodiac';
import { relationshipTypes } from '../data/relationshipTypes';
const metricKeys: MetricKey[] = ['personality', 'conversation', 'rhythm', 'recovery', 'growth'];
const textKeys = ['title', 'subtitle', 'good', 'friction', 'tip', 'wish', 'quote'] as const;
function displayPerson(p: DisplayPerson): DisplayPerson {
  return { nickname: p.nickname, role: p.role, zodiac: p.zodiac, element: p.element };
}
/** Explicit allowlist: never serialize PersonInput, Saju, birth dates, times, or pillars. */
export function sharePayload(r: Result): Result {
  return {
    version: 1,
    parent: displayPerson(r.parent),
    child: displayPerson(r.child),
    score: r.score,
    metrics: {
      personality: r.metrics.personality,
      conversation: r.metrics.conversation,
      rhythm: r.metrics.rhythm,
      recovery: r.metrics.recovery,
      growth: r.metrics.growth,
    },
    typeId: r.typeId,
    title: r.title,
    subtitle: r.subtitle,
    good: r.good,
    friction: r.friction,
    tip: r.tip,
    wish: r.wish,
    quote: r.quote,
    unknownTime: r.unknownTime,
    boundaryUncertain: r.boundaryUncertain,
  };
}
export function createShareUrl(r: Result, base = window.location.href) {
  const data = new TextEncoder().encode(JSON.stringify(sharePayload(r)));
  const token = btoa(String.fromCharCode(...data))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
  const url = new URL(base);
  url.search = '';
  url.hash = `result=${token}`;
  return url.href;
}
function validPerson(value: unknown, roles: string[]): value is DisplayPerson {
  if (!value || typeof value !== 'object') return false;
  const p = value as DisplayPerson;
  return (
    typeof p.nickname === 'string' &&
    p.nickname.trim().length > 0 &&
    p.nickname.length <= 12 &&
    roles.includes(p.role) &&
    Object.values(zodiac).includes(p.zodiac) &&
    elements.includes(p.element)
  );
}
export function readSharedResult(hash: string): Result | null {
  if (!hash.startsWith('#result=') || hash.length > 16000) return null;
  try {
    const token = hash.slice(8);
    if (!/^[A-Za-z0-9_-]+$/.test(token)) return null;
    const bytes = Uint8Array.from(atob(token.replaceAll('-', '+').replaceAll('_', '/')), (c) =>
      c.charCodeAt(0),
    );
    const r = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as Result;
    const scoreValid = (v: unknown) =>
      typeof v === 'number' && Number.isInteger(v) && v >= 45 && v <= 98;
    if (
      r.version !== 1 ||
      !validPerson(r.parent, ['엄마', '아빠']) ||
      !validPerson(r.child, ['딸', '아들']) ||
      !scoreValid(r.score) ||
      !r.metrics ||
      !metricKeys.every((k) => scoreValid(r.metrics[k])) ||
      !relationshipTypes.some((t) => t.id === r.typeId) ||
      !textKeys.every((k) => typeof r[k] === 'string' && r[k].length > 0 && r[k].length <= 500) ||
      typeof r.unknownTime !== 'boolean' ||
      typeof r.boundaryUncertain !== 'boolean'
    )
      return null;
    return sharePayload(r);
  } catch {
    return null;
  }
}
export async function copyUrl(url: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return;
    } catch {
      /* use a selectable fallback */
    }
  }
  const el = document.createElement('textarea');
  el.value = url;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.append(el);
  el.select();
  try {
    if (!document.execCommand('copy')) throw new Error('copy failed');
  } finally {
    el.remove();
  }
}
