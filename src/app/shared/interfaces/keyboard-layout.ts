import {KeyboardLanguage} from './keyboard-language';
export interface KeyboardLayout {
  selectable: string[];
  english: KeyboardLanguage;
  russian: KeyboardLanguage;
  numeric: KeyboardLanguage;
  symbolic: KeyboardLanguage;
}
