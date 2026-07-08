import {
  getTranslationKeys,
  LANG,
  Language,
  LANGUAGES,
  TranslationKey,
} from "../../translations/i18n";
import { CR, TAB } from "../model/constants";
import { AbstractWeiduService } from "./weidu/abstract-weidu.service";
import { StringReference } from "../model/final/stringref";
import utils from "./utils/utils.service";

class TranslationService extends AbstractWeiduService {
  private availableStringRef = 10000;
  private translations: { key: TranslationKey; stringRef: number }[] = [];
  private customTranslations: { text: string; stringRef: number }[] = [];

  t = getTranslationKeys(LANG);

  constructor() {
    super();
    this.generateStringRefs();
  }

  addCustomTranslation(text: string[]): number {
    const stringRef = this.availableStringRef++;
    this.customTranslations.push({ text: text.join(CR), stringRef });
    return stringRef;
  }

  stringRef(key: TranslationKey): number {
    const t = this.translations.find((v) => v.key === key);
    if (!t) throw new Error(`key ${key} not registered`);
    return t.stringRef;
  }

  from(ref: StringReference, lang = LANG): string {
    return typeof ref === "string"
      ? this.fromKey(ref, lang)
      : this.fromStringRef(ref, lang);
  }

  fromOptional(ref: StringReference | undefined): string {
    if (!ref) return "";
    return this.from(ref);
  }

  interpolate(
    key: TranslationKey,
    vars: Record<string, string | number>
  ): string {
    let text = this.fromKey(key);
    for (const key of utils.objectKeys(vars)) {
      text = text.replace(new RegExp(`{{${key}}}`, "g"), `${vars[key]}`);
    }
    return text;
  }

  private fromKey(path: TranslationKey, lang = LANG): string {
    let value = getTranslationKeys(lang) as any;
    for (let i = 0, p = path.split("."), len = p.length; i < len; i++) {
      value = value[p[i]];
    }
    return value;
  }

  private fromStringRef(stringRef: number, lang = LANG): string {
    const translation = this.customTranslations.find(
      (t) => t.stringRef === stringRef
    );
    if (!translation) throw new Error(`stringRef not found: ${stringRef}`);
    return translation.text;
  }

  generateStringRefs() {
    const translations = getTranslationKeys(LANG);
    this.browseTranslations(translations, "");
  }

  browseTranslations(obj: Object, key: string) {
    for (const [k, v] of Object.entries(obj)) {
      const newKey = [key, k].filter((k) => !!k).join(".");
      if (typeof v === "string" && !v.includes("{{")) {
        this.translations.push({
          key: newKey as TranslationKey,
          stringRef: this.availableStringRef++,
        });
      } else if (typeof v !== "string") this.browseTranslations(v, newKey);
    }
  }

  generateWeiduFiles() {
    for (const lang of LANGUAGES) {
      this.generateWeiduFile(lang);
    }
  }

  generateWeiduFile(lang: Language) {
    const lines = this.initLines();
    for (const t of this.translations) {
      const text = this.fromKey(t.key, lang);
      this.add(lines, `@${t.stringRef} = ~${text}~`);
    }
    for (const t of this.customTranslations) {
      this.add(lines, `@${t.stringRef} = ~${t.text}~`);
    }
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    utils.writeFile(`tra/${lang}/generated.tra`, content);
  }
}

const translationService = new TranslationService();
export default translationService;
