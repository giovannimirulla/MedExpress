package com.medexpress.dto;

import java.util.List;

public class CommonPackage {
    private String idPackage;
    private String denominazionePackage;
    private String classeFornitura;
    private String aic;
    private List<String> descrizioneRf;

    // Getters and setters
    public String getIdPackage() {
        return idPackage;
    }
    public void setIdPackage(String idPackage) {
        this.idPackage = idPackage;
    }
    public String getDenominazionePackage() {
        return denominazionePackage;
    }
    public void setDenominazionePackage(String denominazionePackage) {
        this.denominazionePackage = denominazionePackage;
    }
    public String getClasseFornitura() {
        return classeFornitura;
    }
    public void setClasseFornitura(String classeFornitura) {
        this.classeFornitura = classeFornitura;
    }
    public String getAic() {
        return aic;
    }
    public void setAic(String aic) {
        this.aic = aic;
    }
    public List<String> getDescrizioneRf() {
        return descrizioneRf;
    }
    public void setDescrizioneRf(List<String> descrizioneRf) {
        this.descrizioneRf = descrizioneRf;
    }
}
