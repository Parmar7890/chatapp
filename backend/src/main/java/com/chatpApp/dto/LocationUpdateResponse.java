package com.chatpApp.dto;

import lombok.AllArgsConstructor;


public class LocationUpdateResponse {

    private String geohash;
    private String message;

    public LocationUpdateResponse(String geohash, String message) {
        this.geohash = geohash;
        this.message = message;
    }

   public String getGeohash() {
       return geohash;
   }

   public String getMessage() {
       return message;
   }

   public void setGeohash(String geohash) {
       this.geohash = geohash;
   }

   public void setMessage(String message) {
       this.message = message;
   }
}
