import { GTranslateResponse } from "./types";

const translateG = async (text: string, source: string, target: string, original: boolean) => {
  if (original) return { source_lang: source, text };
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&dj=1&q=${encodeURIComponent(text)}`;
  const data: GTranslateResponse = await (await fetch(url)).json();
  return { source_lang: source, text: data.sentences?.map(s => s.trans).join("") || "" };
};

export const TranslateAPI = {
  translate: translateG,
};