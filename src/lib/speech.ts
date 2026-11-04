export interface SpeechHandle {
  stop: () => void;
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

interface Line {
  role: 'M' | 'W' | 'N';
  text: string;
}

function parseScript(script: string): Line[] {
  const lines: Line[] = [];
  for (const raw of script.split(/\n+/)) {
    const line = raw.trim();
    if (!line) continue;
    const match = line.match(/^(M|W|N|Man|Woman|Narrator)\s*:\s*(.*)$/i);
    if (match) {
      const roleRaw = match[1].toUpperCase();
      const role: Line['role'] = roleRaw.startsWith('M') ? 'M' : roleRaw.startsWith('W') ? 'W' : 'N';
      lines.push({ role, text: match[2] });
    } else {
      lines.push({ role: 'N', text: line });
    }
  }
  return lines;
}

function pickEnglishVoice(): SpeechSynthesisVoice | undefined {
  if (!speechSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /^en[-_]US/i.test(v.lang)) ??
    voices.find((v) => /^en[-_]GB/i.test(v.lang)) ??
    voices.find((v) => /^en/i.test(v.lang))
  );
}

/**
 * Read a listening script with alternating pitch for M/W lines.
 * Returns null when the browser has no speech synthesis support.
 */
export function speakScript(
  script: string,
  options: { rate?: number; onEnd?: () => void; onError?: () => void } = {},
): SpeechHandle | null {
  if (!speechSupported()) return null;
  const synth = window.speechSynthesis;
  synth.cancel();
  const lines = parseScript(script);
  if (lines.length === 0) return null;
  const voice = pickEnglishVoice();
  let cancelled = false;

  const speakAt = (index: number) => {
    if (cancelled || index >= lines.length) {
      if (!cancelled) options.onEnd?.();
      return;
    }
    const line = lines[index];
    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = 'en-US';
    utterance.rate = options.rate ?? 0.95;
    if (voice) utterance.voice = voice;
    if (line.role === 'M') utterance.pitch = 0.82;
    else if (line.role === 'W') utterance.pitch = 1.18;
    else utterance.pitch = 1;
    utterance.onend = () => {
      window.setTimeout(() => speakAt(index + 1), 260);
    };
    utterance.onerror = () => {
      if (!cancelled) options.onError?.();
    };
    synth.speak(utterance);
  };

  // Voices may load asynchronously; still start with the default voice.
  speakAt(0);

  return {
    stop: () => {
      cancelled = true;
      synth.cancel();
    },
  };
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
