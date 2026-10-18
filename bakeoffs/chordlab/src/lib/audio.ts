export type PlaybackHandle = {
  stop: () => void
}

type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }

let context: AudioContext | undefined
let activeHandles = new Set<PlaybackHandle>()

function getAudioContext() {
  if (typeof window === 'undefined') throw new Error('Audio is only available in a browser.')
  const AudioContextConstructor = (window as AudioWindow).AudioContext ?? (window as AudioWindow).webkitAudioContext
  if (!AudioContextConstructor) throw new Error('This browser does not support Web Audio. Try a recent version of Chrome, Edge, or Safari.')
  context ??= new AudioContextConstructor()
  return context
}

export async function playNotes(midiNotes: readonly number[], durationSeconds?: number): Promise<PlaybackHandle> {
  const notes = [...new Set(midiNotes)].filter((note) => Number.isFinite(note))
  if (notes.length === 0) throw new Error('Select at least one note before playing.')

  const audioContext = getAudioContext()
  await audioContext.resume()
  stopAllAudio()

  
  const gain = audioContext.createGain()
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.03)
  const filter = audioContext.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(500, audioContext.currentTime);
  gain.connect(filter)
  filter.connect(audioContext.destination)
  const oscillators = notes.map((midi) => {
    const oscillator = audioContext.createOscillator()
    oscillator.type = 'sawtooth'
    oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12)
    oscillator.connect(gain)
    oscillator.start()
    return oscillator
  })

  let stopped = false
  const stop = () => {
    if (stopped) return
    stopped = true
    const now = audioContext.currentTime
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
    oscillators.forEach((oscillator) => oscillator.stop(now + 0.05))
    gain.disconnect()
    activeHandles.delete(handle)
  }
  const handle = { stop }
  activeHandles.add(handle)

  if (durationSeconds !== undefined) window.setTimeout(stop, Math.max(0, durationSeconds * 1000))
  return handle
}

export function stopAllAudio() {
  activeHandles.forEach((handle) => handle.stop())
  activeHandles = new Set()
}
