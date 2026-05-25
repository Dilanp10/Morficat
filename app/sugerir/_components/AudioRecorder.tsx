"use client";

import { Mic, Pause, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_SECONDS = 60;

export function AudioRecorder({
  onChange,
}: {
  onChange: (file: File | null) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (tickRef.current) clearInterval(tickRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        const ext = blob.type.includes("ogg")
          ? "ogg"
          : blob.type.includes("mp4")
            ? "m4a"
            : "webm";
        const file = new File([blob], `audio.${ext}`, { type: blob.type });
        onChange(file);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start();
      setRecording(true);
      setSeconds(0);
      tickRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stop();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError(
        "No pudimos acceder al micrófono. Permiso denegado o sin micrófono disponible.",
      );
    }
  };

  const stop = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  const reset = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setSeconds(0);
    onChange(null);
  };

  return (
    <div className="rounded-card border border-foreground/10 bg-card p-4">
      {!blobUrl ? (
        <div className="text-center">
          <button
            type="button"
            onClick={recording ? stop : start}
            className={`inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3 font-medium transition-colors ${
              recording
                ? "bg-danger text-white"
                : "bg-terracota text-white hover:bg-terracota-deep"
            }`}
          >
            {recording ? <Pause size={18} /> : <Mic size={18} />}
            {recording ? `Detener (${seconds}s)` : "Grabar audio"}
          </button>
          {!recording && (
            <p className="text-xs text-foreground/60 mt-3">
              Máximo {MAX_SECONDS} segundos
            </p>
          )}
          {recording && (
            <p className="text-xs text-foreground/60 mt-3">
              Grabando... tocá para detener
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <audio src={blobUrl} controls className="w-full" />
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-danger transition-colors"
          >
            <Trash2 size={14} />
            Borrar y grabar de nuevo
          </button>
        </div>
      )}
      {error && <p className="text-sm text-danger mt-3">{error}</p>}
    </div>
  );
}
