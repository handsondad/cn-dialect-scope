export type CharacterId = "nian" | "dad";

export const characterNames: Record<CharacterId, string> = { nian: "小念", dad: "爸爸" };

export type Look = {
  palette: Record<"Skin" | "Shirt" | "Pants" | "Belt" | "Face" | "Hair", string>;
  /** Standing height in world units. */
  height: number;
  /** The source model is a big-headed cartoon; a smaller head reads as grown-up. */
  headScale: number;
  glasses: boolean;
};

export const looks: Record<CharacterId, Look> = {
  nian: {
    palette: { Skin: "#f5c9a6", Shirt: "#ff8a5c", Pants: "#3d6fd6", Belt: "#2b3f80", Face: "#3a2418", Hair: "#5a3a22" },
    height: 1.3, headScale: 1, glasses: false
  },
  dad: {
    palette: { Skin: "#eab892", Shirt: "#3f78c9", Pants: "#4a4d5c", Belt: "#2a2c36", Face: "#2e1d14", Hair: "#2a1c14" },
    height: 1.85, headScale: 0.8, glasses: true
  }
};
