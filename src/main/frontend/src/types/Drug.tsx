export interface Drug {
    id: string;
    medicinale: {
        denominazioneMedicinale: string;
    };
    formaFarmaceutica: string;
    vieSomministrazione: string[];
    descrizioneFormaDosaggio: string;
    principiAttiviIt:string[];
    confezioni: {
      idPackage: string;
      denominazionePackage: string;
      classeFornitura: string;
      aic: string;
      descrizioneRf: string[];
    }[];
  }
