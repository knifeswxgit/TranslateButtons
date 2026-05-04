export interface DeepLResponse {
  alternatives?: string[];
  code?: number;
  message?: string;
  data?: string;
  id?: number;
}

export interface GTranslateResponse {
  src?: string;
  sentences?: { trans?: string }[];
}

export const DeepLLangs = {
  Arabic: "AR",
  Bulgarian: "BG",
  Czech: "CS",
  Danish: "DA",
  German: "DE",
  Greek: "EL",
  English: "EN",
  Spanish: "ES",
  Finnish: "FI",
  French: "FR",
  Hungarian: "HU",
  Indonesian: "ID",
  Italian: "IT",
  Japanese: "JA",
  Korean: "KO",
  Dutch: "NL",
  Polish: "PL",
  Portuguese: "PT",
  Romanian: "RO",
  Russian: "RU",
  Swedish: "SV",
  Turkish: "TR",
  ChineseSimplified: "ZH",
} as const;

export const GTranslateLangs = {
  English: "en",
  Russian: "ru",
  German: "de",
  French: "fr",
  Spanish: "es",
} as const;