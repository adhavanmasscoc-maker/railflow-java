package com.railflow.model;

import java.time.LocalDateTime;

/**
 * Entity representing an Indian Railways PNR reservation record persisted in SQLite.
 */
public class PnrRecord {

    private String pnrNumber;
    private String trainNumber;
    private String trainName;
    private String travelDate;
    private String classType;
    private String chartStatus;
    private String fromStationCode;
    private String fromStationName;
    private String toStationCode;
    private String toStationName;
    private String boardingCode;
    private String boardingName;
    private String bookingStatus;
    private String currentStatus;
    private String passengersJson;
    private LocalDateTime createdAt;

    public PnrRecord() {
        this.createdAt = LocalDateTime.now();
    }

    public PnrRecord(String pnrNumber, String trainNumber, String trainName, String travelDate,
                     String classType, String chartStatus, String fromStationCode, String fromStationName,
                     String toStationCode, String toStationName, String boardingCode, String boardingName,
                     String bookingStatus, String currentStatus, String passengersJson) {
        this.pnrNumber = pnrNumber;
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.travelDate = travelDate;
        this.classType = classType;
        this.chartStatus = chartStatus;
        this.fromStationCode = fromStationCode;
        this.fromStationName = fromStationName;
        this.toStationCode = toStationCode;
        this.toStationName = toStationName;
        this.boardingCode = boardingCode;
        this.boardingName = boardingName;
        this.bookingStatus = bookingStatus;
        this.currentStatus = currentStatus;
        this.passengersJson = passengersJson;
        this.createdAt = LocalDateTime.now();
    }

    public String getPnrNumber() {
        return pnrNumber;
    }

    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
    }

    public String getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public String getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(String travelDate) {
        this.travelDate = travelDate;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getChartStatus() {
        return chartStatus;
    }

    public void setChartStatus(String chartStatus) {
        this.chartStatus = chartStatus;
    }

    public String getFromStationCode() {
        return fromStationCode;
    }

    public void setFromStationCode(String fromStationCode) {
        this.fromStationCode = fromStationCode;
    }

    public String getFromStationName() {
        return fromStationName;
    }

    public void setFromStationName(String fromStationName) {
        this.fromStationName = fromStationName;
    }

    public String getToStationCode() {
        return toStationCode;
    }

    public void setToStationCode(String toStationCode) {
        this.toStationCode = toStationCode;
    }

    public String getToStationName() {
        return toStationName;
    }

    public void setToStationName(String toStationName) {
        this.toStationName = toStationName;
    }

    public String getBoardingCode() {
        return boardingCode;
    }

    public void setBoardingCode(String boardingCode) {
        this.boardingCode = boardingCode;
    }

    public String getBoardingName() {
        return boardingName;
    }

    public void setBoardingName(String boardingName) {
        this.boardingName = boardingName;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(String currentStatus) {
        this.currentStatus = currentStatus;
    }

    public String getPassengersJson() {
        return passengersJson;
    }

    public void setPassengersJson(String passengersJson) {
        this.passengersJson = passengersJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
