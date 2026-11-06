// Hole sizes from a metric fastener: the ISO 273 clearance hole for a bolt (close, normal or
// loose fit), the tap drill for an ISO metric coarse thread (major diameter minus pitch), the
// counterbore for an ISO 4762 socket head cap screw (DIN 974-1) and the countersink for an
// ISO 10642 countersunk head screw (its head's theoretical diameter at 90 deg).
// The numbers are the standards' published values; the clearance holes, pitches and ISO 4762
// head sizes were cross-checked against SolidCraft's tables (https://github.com/tangency-labs/
// solidcraft, MIT OR Apache-2.0), which THIRD_PARTY_NOTICES.md credits.
// Owner: ASSISTANT (the person's side of hole).
// SPDX-License-Identifier: GPL-3.0-or-later

import type { ExtrudeExtentDef } from '../../types/doc';

export type ClearanceFit = 'close' | 'normal' | 'loose';

/** One metric size: its major diameter, ISO 261 coarse pitch and ISO 273 clearance holes (mm). */
export interface MetricSize {
  size: string;
  d: number;
  pitch: number;
  close: number;
  normal: number;
  loose: number;
}

const ROWS: readonly [number, number, number, number, number][] = [
  [1.6, 0.35, 1.7, 1.8, 2.0],
  [2, 0.4, 2.2, 2.4, 2.6],
  [2.5, 0.45, 2.7, 2.9, 3.1],
  [3, 0.5, 3.2, 3.4, 3.6],
  [4, 0.7, 4.3, 4.5, 4.8],
  [5, 0.8, 5.3, 5.5, 5.8],
  [6, 1, 6.4, 6.6, 7.0],
  [8, 1.25, 8.4, 9.0, 10.0],
  [10, 1.5, 10.5, 11.0, 12.0],
  [12, 1.75, 13.0, 13.5, 14.5],
  [14, 2, 15.0, 15.5, 16.5],
  [16, 2, 17.0, 17.5, 18.5],
  [20, 2.5, 21.0, 22.0, 24.0],
  [24, 3, 25.0, 26.0, 28.0],
  [30, 3.5, 31.0, 33.0, 35.0],
  [36, 4, 37.0, 39.0, 42.0],
  [42, 4.5, 43.0, 45.0, 48.0],
  [48, 5, 50.0, 52.0, 56.0],
  [56, 5.5, 58.0, 62.0, 66.0],
  [60, 5.5, 62.0, 66.0, 70.0],
  [64, 6, 66.0, 70.0, 74.0],
];

export const METRIC_SIZES: readonly MetricSize[] = ROWS.map(([d, pitch, close, normal, loose]) => ({ size: `M${d}`, d, pitch, close, normal, loose }));

/** The row for "M6" (any case; "M6x1" too, but only with its coarse pitch: the tables are for coarse threads), or null. */
export function metricSize(size: string): MetricSize | null {
  const m = /^\s*m\s*(\d+(?:\.\d+)?)\s*(?:x\s*([\d.]+))?\s*$/i.exec(size);
  if (!m) return null;
  const row = METRIC_SIZES.find((r) => Math.abs(r.d - Number(m[1])) < 1e-9) ?? null;
  return row && (m[2] === undefined || Math.abs(Number(m[2]) - row.pitch) < 1e-9) ? row : null;
}

/** The ISO 273 clearance hole for a bolt size and fit (mm), or null for a size not in the table. */
export function clearanceDiameter(size: string, fit: ClearanceFit): number | null {
  const r = metricSize(size);
  return r ? r[fit] : null;
}

/** The tap drill for an ISO metric coarse thread (major diameter minus pitch, mm), or null. */
export function tapDrill(size: string): number | null {
  const r = metricSize(size);
  return r ? Math.round((r.d - r.pitch) * 1000) / 1000 : null;
}

/**
 * Counterbores for ISO 4762 socket head cap screws (DIN 974-1): the counterbore's diameter and
 * depth (mm), the screw's head (dk, k) sitting just below the face. M3 to M30.
 */
const COUNTERBORES: readonly [number, number, number][] = [
  [3, 6.5, 3.4],
  [4, 8, 4.4],
  [5, 10, 5.4],
  [6, 11, 6.4],
  [8, 15, 8.6],
  [10, 18, 10.6],
  [12, 20, 12.6],
  [14, 24, 14.6],
  [16, 26, 16.6],
  [20, 33, 20.6],
  [24, 40, 24.8],
  [30, 48, 30.8],
];

/** Countersinks for ISO 10642 countersunk head screws: the head's theoretical diameter dk at 90 deg (mm), so it sits flush. M3 to M20. */
const COUNTERSINKS: readonly [number, number][] = [
  [3, 6.72],
  [4, 8.96],
  [5, 11.2],
  [6, 13.44],
  [8, 17.92],
  [10, 22.4],
  [12, 26.88],
  [14, 30.8],
  [16, 33.6],
  [20, 40.32],
];

/** The counterbore for an ISO 4762 socket head cap screw of this size, or null. */
export function counterboreFor(size: string): { diameter: number; depth: number } | null {
  const r = metricSize(size);
  const row = r ? COUNTERBORES.find((x) => Math.abs(x[0] - r.d) < 1e-9) : undefined;
  return row ? { diameter: row[1], depth: row[2] } : null;
}

/** The countersink for an ISO 10642 countersunk head screw of this size (its diameter at the face, mm; the angle is 90 deg), or null. */
export function countersinkFor(size: string): { diameter: number } | null {
  const r = metricSize(size);
  const row = r ? COUNTERSINKS.find((x) => Math.abs(x[0] - r.d) < 1e-9) : undefined;
  return row ? { diameter: row[1] } : null;
}

/** How deep a cut's cosmetic thread runs, in words: a Blind cut's distance, else the whole hole (its cut's own extent). */
export function threadDepthWords(extent: ExtrudeExtentDef): string {
  return extent.kind === 'blind' ? `${extent.distance} deep` : extent.kind === 'through_all' ? 'the whole hole' : "the cut's depth";
}

/** The sizes each table has, for the words of a refusal ("M3 to M30"). */
export const COUNTERBORE_SIZES = 'M3 to M30';
export const COUNTERSINK_SIZES = 'M3 to M20';

/** "M6x1": a size with its coarse pitch, or null. */
export function threadName(size: string): string | null {
  const r = metricSize(size);
  return r ? `${r.size}x${r.pitch}` : null;
}
