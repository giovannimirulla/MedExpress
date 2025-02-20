package com.medexpress.dto;

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
        private java.util.List<CommonDrug> content;
        private Pageable pageable;
        private boolean last;
        private int totalPages;
        private int totalElements;
        private boolean first;
        private int numberOfElements;
        private int size;
        private int number;
        private boolean empty;

        public java.util.List<CommonDrug> getContent() {
            return content;
        }
        public void setContent(java.util.List<CommonDrug> content) {
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