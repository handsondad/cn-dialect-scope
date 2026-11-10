import type { Font } from "../data/films/types";

/** 楷书里没有的方言字（冇、佢、咗、𠊎）浏览器会一个字一个字地退回后面的系统字体 */
export const fontFamily: Record<Font, string> = {
  kai: '"Ma Shan Zheng", "KaiTi", "STKaiti", serif',
  song: '"Noto Serif SC", "Songti SC", "SimSun", serif'
};

/** 汉字配拼音、粤拼：字母和声调符号用无衬线体，汉字再退回楷书。楷书字体里的 ā、ǎ 不全 */
export const mixedFamily = `"Segoe UI", "Helvetica Neue", Arial, ${fontFamily.kai}`;
