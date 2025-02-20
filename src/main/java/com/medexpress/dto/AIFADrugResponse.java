package com.medexpress.dto;

public class AIFADrugResponse {
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

    public static class Data extends CommonDrug {
        private int flagAlcol;
        private int flagPotassio;
        private int flagGuida;
        private int flagDopante;
        private Object livelloGuida;
        private Object descrizioneLivello;
        private int carente;
        private int innovativo;
        private int orfano;
        private int revocato;
        private int sospeso;
        private Object position;

        public int getFlagAlcol() {
            return flagAlcol;
        }
        public void setFlagAlcol(int flagAlcol) {
            this.flagAlcol = flagAlcol;
        }

        public int getFlagPotassio() {
            return flagPotassio;
        }
        public void setFlagPotassio(int flagPotassio) {
            this.flagPotassio = flagPotassio;
        }

        public int getFlagGuida() {
            return flagGuida;
        }
        public void setFlagGuida(int flagGuida) {
            this.flagGuida = flagGuida;
        }

        public int getFlagDopante() {
            return flagDopante;
        }
        public void setFlagDopante(int flagDopante) {
            this.flagDopante = flagDopante;
        }

        public Object getLivelloGuida() {
            return livelloGuida;
        }
        public void setLivelloGuida(Object livelloGuida) {
            this.livelloGuida = livelloGuida;
        }

        public Object getDescrizioneLivello() {
            return descrizioneLivello;
        }
        public void setDescrizioneLivello(Object descrizioneLivello) {
            this.descrizioneLivello = descrizioneLivello;
        }

        public int getCarente() {
            return carente;
        }
        public void setCarente(int carente) {
            this.carente = carente;
        }

        public int getInnovativo() {
            return innovativo;
        }
        public void setInnovativo(int innovativo) {
            this.innovativo = innovativo;
        }

        public int getOrfano() {
            return orfano;
        }
        public void setOrfano(int orfano) {
            this.orfano = orfano;
        }

        public int getRevocato() {
            return revocato;
        }
        public void setRevocato(int revocato) {
            this.revocato = revocato;
        }

        public int getSospeso() {
            return sospeso;
        }
        public void setSospeso(int sospeso) {
            this.sospeso = sospeso;
        }

        public Object getPosition() {
            return position;
        }
        public void setPosition(Object position) {
            this.position = position;
        }
    }
}