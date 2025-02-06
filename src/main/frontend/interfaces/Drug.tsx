interface Drug {
    medicinale: {
        denominazioneMedicinale: string;
    };
    formaFarmaceutica: string;
    vieSomministrazione: string;
    descrizioneFormaDosaggio: string;
    confezioni: {
      idPackage: string;
      denominazionePackage: string;
      classeFornitura: string;
      aic: string;
      descrizioneRf: string[];
    }[];
  }
