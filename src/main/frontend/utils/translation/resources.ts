import appEn from "../../locales/en/app.json";
// import sharedEn from "@Locales/en/shared.json";

import appIt from "../../locales/it/app.json";
// import sharedJa from "@Locales/it/shared.json";

export const resources = {
  en: {
    app: appEn,
    // shared: sharedEn
  },
  it: {
    app: appIt,
    // shared: sharedJa
  },
};

export const ns = Object.keys(resources.en);
