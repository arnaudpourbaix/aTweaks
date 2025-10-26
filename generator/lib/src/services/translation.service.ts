import {
  getTranslationKeys,
  LANG,
  TranslationKey,
} from "../../translations/i18n";

class TranslationService {
  t = getTranslationKeys(LANG);

  fromKey(path: TranslationKey) {
    let value = this.t as any;
    for (let i = 0, p = path.split("."), len = p.length; i < len; i++) {
      value = value[p[i]];
    }
    return value;
  }
}

const translationService = new TranslationService();
export default translationService;
