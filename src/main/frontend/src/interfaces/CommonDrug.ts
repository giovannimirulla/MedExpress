export interface CommonDrug {
    id: string;
    formaFarmaceutica: string;
    medicinale: {
        denominazioneMedicinale: string;
    };
    vieSomministrazione: string[];
    descrizioneFormaDosaggio: string;
    principiAttiviIt: string[];
}