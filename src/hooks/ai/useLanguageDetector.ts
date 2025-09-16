import { useRef, useState } from "react";

export type Detection = { language: string; confidence: number };

export function useLanguageDetector(opts?: {
  /** Accept top result only if confidence >= minConfidence (default 0.7). */
  minConfidence?: number;
  /** Optionally hint expected languages to the detector. */
  priorityLanguages?: string[];
}) {
  const minConfidence = opts?.minConfidence ?? 0.7;
  const priority = opts?.priorityLanguages;

  const isSupported =
    typeof window !== "undefined" && "LanguageDetector" in self;

  const detectorRef = useRef<any | null>(null);
  const [progress, setProgress] = useState(0); // 0..1; becomes 1 when ready

  /**
   * Must be called from a user gesture. Triggers model download/creation.
   * Resolves true when the detector is ready.
   */
  async function ensureReady(): Promise<boolean> {
    if (!isSupported) return false;
    if (detectorRef.current) return true;

    const onProgress = (e: any) => {
      // Chrome fires `downloadprogress` with { loaded: 0..1 }.
      const p = typeof e?.loaded === "number" ? e.loaded : 0;
      setProgress(p);
    };

    const detector = await (self as any).LanguageDetector.create({
      ...(priority?.length ? { priority } : {}),
      monitor(m: EventTarget) {
        m.addEventListener("downloadprogress", onProgress, {
          passive: true,
        });
      },
    });

    detectorRef.current = detector;
    setProgress(1);
    return true;
  }

  /**
   * Returns the best guess or null if not ready / below confidence.
   */
  async function detect(text: string): Promise<Detection | null> {
    if (!text?.trim()) {
      return null;
    }

    if (!detectorRef.current || progress < 1) {
      return null;
    }

    const ranked = (await detectorRef.current.detect(text)) as Array<{
      detectedLanguage: string;
      confidence: number;
    }>;
    const top = ranked[0];
    if (!top || top.confidence < minConfidence) {
      return null;
    }

    return {
      language: top.detectedLanguage,
      confidence: top.confidence,
    };
  }

  return { isSupported, progress, ensureReady, detect };
}
