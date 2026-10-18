export const ROOTS = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

export type Root = (typeof ROOTS)[number]
export type ScaleId = 'major' | 'natural-minor'

export type Scale = {
  id: ScaleId
  name: string
  intervals: readonly number[]
  degreeNames: readonly string[]
  romanNumerals: readonly string[]
}

export type ChordQuality = 'major' | 'minor' | 'diminished'

export type Chord = {
  id: string
  symbol: string
  notes: readonly string[]
  quality: ChordQuality
  romanNumeral: string
  degree: number
}

export const SCALES: readonly Scale[] = [
  {
    id: 'major',
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    degreeNames: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'],
    romanNumerals: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  },
  {
    id: 'natural-minor',
    name: 'Natural minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    degreeNames: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'],
    romanNumerals: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
  },
]

const TRIAD_INTERVALS = [0, 2, 4]

function getScale(scaleId: ScaleId) {
  return SCALES.find((scale) => scale.id === scaleId) ?? SCALES[0]
}

function getChordQuality(intervals: readonly number[]): ChordQuality {
  const signature = intervals.join(',')
  if (signature === '0,3,6') return 'diminished'
  if (signature === '0,3,7') return 'minor'
  return 'major'
}

export function deriveChords(root: Root, scaleId: ScaleId): Chord[] {
  const scale = getScale(scaleId)
  const rootIndex = ROOTS.indexOf(root)
  const scaleNotes = scale.intervals.map((interval) => ROOTS[(rootIndex + interval) % 12])

  return scaleNotes.map((chordRoot, degree) => {
    const noteIndexes = TRIAD_INTERVALS.map(
      (offset) => (degree + offset) % scaleNotes.length,
    )
    const notes = noteIndexes.map((index) => scaleNotes[index])
    const intervals = noteIndexes.map(
      (index) => (ROOTS.indexOf(scaleNotes[index]) - ROOTS.indexOf(chordRoot) + 12) % 12,
    )
    const quality = getChordQuality(intervals)
    const suffix = quality === 'minor' ? 'm' : quality === 'diminished' ? '°' : ''

    return {
      id: `${scale.id}:${root}:${degree + 1}`,
      symbol: `${chordRoot}${suffix}`,
      notes,
      quality,
      romanNumeral: scale.romanNumerals[degree],
      degree: degree + 1,
    }
  })
}
