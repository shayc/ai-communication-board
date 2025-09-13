import { LanguageSettings } from "./LanguageSettings";
import { SpeechSettings } from "./SpeechSettings";

export function Settings() {
  return (
    <div>
      <LanguageSettings />
      <SpeechSettings />
    </div>
  );
}
