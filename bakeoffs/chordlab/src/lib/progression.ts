import type { Chord, Root, ScaleId } from './music'

export type ProgressionEntry = {
  id: string
  chord: Chord
  durationBeats: number
}

export type Progression = {
  title: string
  key: Root
  scale: ScaleId
  tempo: number
  timeSignature: [number, number]
  chords: ProgressionEntry[]
  updatedAt: string
}

export function createProgression(title: string, key: Root, scale: ScaleId): Progression {
  return { title, key, scale, tempo: 100, timeSignature: [4, 4], chords: [], updatedAt: new Date().toISOString() }
}

export function isValidProgression(progression: Progression) {
  return progression.chords.length > 0 && progression.tempo > 0 && progression.chords.every((entry) => entry.durationBeats > 0 && entry.chord.notes.length > 0)
}

export function isProgression(value: unknown): value is Progression {
  if (!value || typeof value !== 'object') return false
  const progression = value as Partial<Progression>
  return (
    typeof progression.title === 'string' &&
    typeof progression.key === 'string' &&
    typeof progression.scale === 'string' &&
    typeof progression.tempo === 'number' &&
    Array.isArray(progression.timeSignature) &&
    progression.timeSignature.length === 2 &&
    Array.isArray(progression.chords) &&
    typeof progression.updatedAt === 'string'
  )
}
