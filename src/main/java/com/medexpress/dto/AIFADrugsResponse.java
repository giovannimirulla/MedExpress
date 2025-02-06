package com.medexpress.dto;

import java.util.List;

public class AIFADrugsResponse {
    private int status;
    private Data data;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {
        private List<Drug> content;
        private Pageable pageable;
        private boolean last;
        private int totalPages;
        private int totalElements;
        private boolean first;
        private int numberOfElements;
        private int size;
        private int number;
        private boolean empty;

        public List<Drug> getContent() {
            return content;
        }

        public void setContent(List<Drug> content) {
            this.content = content;
        }

        public Pageable getPageable() {
            return pageable;
        }

        public void setPageable(Pageable pageable) {
            this.pageable = pageable;
        }

        public boolean isLast() {
            return last;
        }

        public void setLast(boolean last) {
            this.last = last;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public int getTotalElements() {
            return totalElements;
        }

        public void setTotalElements(int totalElements) {
            this.totalElements = totalElements;
        }

        public boolean isFirst() {
            return first;
        }

        public void setFirst(boolean first) {
            this.first = first;
        }

        public int getNumberOfElements() {
            return numberOfElements;
        }

        public void setNumberOfElements(int numberOfElements) {
            this.numberOfElements = numberOfElements;
        }

        public int getSize() {
            return size;
        }

        public void setSize(int size) {
            this.size = size;
        }

        public int getNumber() {
            return number;
        }

        public void setNumber(int number) {
            this.number = number;
        }

        public boolean isEmpty() {
            return empty;
        }

        public void setEmpty(boolean empty) {
            this.empty = empty;
        }
    }

    public static class Drug {
        private String id;
        private List<String> principiAttiviIt;
        private List<Package> confezioni;
        private Medicinal medicinale;
        private List<String> vieSomministrazione;
        private List<String> codiceAtc;
        private List<String> descrizioneAtc;
        private String formaFarmaceutica;
        private String descrizioneFormaDosaggio;
        private String icon;

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

        public List<Package> getConfezioni() {
            return confezioni;
        }

        public void setConfezioni(List<Package> confezioni) {
            this.confezioni = confezioni;
        }

        public Medicinal getMedicinale() {
            return medicinale;
        }

        public void setMedicinale(Medicinal medicinale) {
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
        
        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }
    }

    public static class Package {
        private String idPackage;
        private String denominazionePackage;
        private String classeFornitura;
        private String aic;
        private List<String> descrizioneRf;

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

    public static class Medicinal {
        private String codiceMedicinale;
        private int aic6;
        private String denominazioneMedicinale;

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

    public static class Pageable {
        private int pageNumber;
        private int pageSize;

        public int getPageNumber() {
            return pageNumber;
        }

        public void setPageNumber(int pageNumber) {
            this.pageNumber = pageNumber;
        }

        public int getPageSize() {
            return pageSize;
        }

        public void setPageSize(int pageSize) {
            this.pageSize = pageSize;
        }
    }
}
