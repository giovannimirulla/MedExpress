import { create } from 'zustand'
import { TFunction } from "i18next";

// Define the store state and actions types
interface TranslationState {
  title: string;
  desc: string;
  setTranslations: (t: TFunction) => void;
  toggleTranslations: (t: TFunction) => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  title: "",
  desc: "",
  setTranslations: (t) => set({
    title: t('forms.creatinine.placeholder.label_second'),
    desc: "mg/dL"
  }),
  toggleTranslations: (t) => set((state) => ({
    title: state.title === t('forms.creatinine.placeholder.label_first')
      ? t('forms.creatinine.placeholder.label_second')
      : t('forms.creatinine.placeholder.label_first'),
    desc: state.desc === "mg/dL" ? "µmol/L" : "mg/dL"
  })),
}));
