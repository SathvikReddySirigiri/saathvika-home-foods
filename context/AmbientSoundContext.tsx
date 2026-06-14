"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const AUDIO_SRC = "/audio/temple-ambience.mp3";
const AUDIO_VOLUME = 0.28;

type AmbientSoundContextValue = {
  playing: boolean;
  loading: boolean;
  available: boolean;
  toggle: () => void;
};

const AmbientSoundContext = createContext<AmbientSoundContextValue | null>(
  null,
);

export function useAmbientSound() {
  const ctx = useContext(AmbientSoundContext);
  if (!ctx) {
    throw new Error("useAmbientSound must be used within AmbientSoundProvider");
  }
  return ctx;
}

export function AmbientSoundProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setPlaying(true);
      setLoading(false);
    };
    const onPause = () => setPlaying(false);
    const onError = () => {
      setAvailable(false);
      setPlaying(false);
      setLoading(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !available) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    audio.volume = AUDIO_VOLUME;

    // Call play() immediately in the click handler (required on iOS/Safari).
    const attemptPlay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        void playPromise.catch(() => {
          if (audio.error) {
            setAvailable(false);
            setPlaying(false);
            setLoading(false);
            return;
          }
          // Not loaded yet — wait for canplay, then try again.
          if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
            setLoading(true);
            const onCanPlay = () => {
              audio.removeEventListener("canplay", onCanPlay);
              setLoading(false);
              void audio.play().catch(() => setPlaying(false));
            };
            audio.addEventListener("canplay", onCanPlay);
            audio.load();
          } else {
            setPlaying(false);
            setLoading(false);
          }
        });
      }
    };

    attemptPlay();
  }, [available]);

  const value = useMemo(
    () => ({ playing, loading, available, toggle }),
    [playing, loading, available, toggle],
  );

  return (
    <AmbientSoundContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        playsInline
        className="hidden"
        aria-hidden
      />
      {children}
    </AmbientSoundContext.Provider>
  );
}
