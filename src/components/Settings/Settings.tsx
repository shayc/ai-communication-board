import { LanguageSettings } from "./LanguageSettings/LanguageSettings";
import { SpeechSettings } from "./SpeechSettings/SpeechSettings";

export function Settings() {
  return (
    <div>
      <LanguageSettings />
      <SpeechSettings />
    </div>
  );
}
