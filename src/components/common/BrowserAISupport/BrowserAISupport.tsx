import { useLanguageDetector } from "../../../hooks/ai/useLanguageDetector";
import { useProofreader } from "../../../hooks/ai/useProofreader";
import { useRewriter } from "../../../hooks/ai/useRewriter";
import { useTranslator } from "../../../hooks/ai/useTranslator";

export function BrowserAISupport() {
  const languageDetector = useLanguageDetector();
  const proofreader = useProofreader();
  const rewriter = useRewriter();
  const translator = useTranslator();

  return (
    <div>
      <div>BrowserAI Support</div>
      Language Detector API:
      {languageDetector.isSupported ? "Supported" : "Not Supported"}
      Proofreader API: {proofreader.isSupported ? "Supported" : "Not Supported"}
      Rewriter API: {rewriter.isSupported ? "Supported" : "Not Supported"}
      Translator API: {translator.isSupported ? "Supported" : "Not Supported"}
    </div>
  );
}
