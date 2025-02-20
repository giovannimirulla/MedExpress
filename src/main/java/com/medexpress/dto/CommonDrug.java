package com.medexpress.dto;

import java.util.List;

public class CommonDrug {
    private String id;
    private List<String> principiAttiviIt;
    private List<CommonPackage> confezioni;
    private CommonMedicinal medicinale;
    private List<String> vieSomministrazione;
    private List<String> codiceAtc;
    private List<String> descrizioneAtc;
    private String formaFarmaceutica;
    private String descrizioneFormaDosaggio;

    // Getters and setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public List<String> getPrincipiAttiviIt() {
        return principiAttiviIt;
    }
    public void setPrincipiAttiviIt(List<String> principiAttiviIt) {
        this.principiAttiviIt = principiAttiviIt;
    }
    public List<CommonPackage> getConfezioni() {
        return confezioni;
    }
    public void setConfezioni(List<CommonPackage> confezioni) {
        this.confezioni = confezioni;
    }
    public CommonMedicinal getMedicinale() {
        return medicinale;
    }
    public void setMedicinale(CommonMedicinal medicinale) {
        this.medicinale = medicinale;
    }
    public List<String> getVieSomministrazione() {
        return vieSomministrazione;
    }
    public void setVieSomministrazione(List<String> vieSomministrazione) {
        this.vieSomministrazione = vieSomministrazione;
    }
    public List<String> getCodiceAtc() {
        return codiceAtc;
    }
    public void setCodiceAtc(List<String> codiceAtc) {
        this.codiceAtc = codiceAtc;
    }
    public List<String> getDescrizioneAtc() {
        return descrizioneAtc;
    }
    public void setDescrizioneAtc(List<String> descrizioneAtc) {
        this.descrizioneAtc = descrizioneAtc;
    }
    public String getFormaFarmaceutica() {
        return formaFarmaceutica;
    }
    public void setFormaFarmaceutica(String formaFarmaceutica) {
        this.formaFarmaceutica = formaFarmaceutica;
    }
    public String getDescrizioneFormaDosaggio() {
        return descrizioneFormaDosaggio;
    }
    public void setDescrizioneFormaDosaggio(String descrizioneFormaDosaggio) {
        this.descrizioneFormaDosaggio = descrizioneFormaDosaggio;
    }
}

class CommonMedicinal {
    private String codiceMedicinale;
    private int aic6;
    private String denominazioneMedicinale;

    // Getters and setters
    public String getCodiceMedicinale() {
        return codiceMedicinale;
    }
    public void setCodiceMedicinale(String codiceMedicinale) {
        this.codiceMedicinale = codiceMedicinale;
    }
    public int getAic6() {
        return aic6;
    }
    public void setAic6(int aic6) {
        this.aic6 = aic6;
    }
    public String getDenominazioneMedicinale() {
        return denominazioneMedicinale;
    }
    public void setDenominazioneMedicinale(String denominazioneMedicinale) {
        this.denominazioneMedicinale = denominazioneMedicinale;
    }
}