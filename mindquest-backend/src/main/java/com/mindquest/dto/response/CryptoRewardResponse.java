package com.mindquest.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoRewardResponse {
    public CryptoRewardResponse(String string, String walletAddress2, String cryptoType2, String value, String string2,
            Object object, LocalDateTime now, String network2) {
        //TODO Auto-generated constructor stub
    }
    private String id;
    private String cryptoType;
    private double amount;
    private String transactionHash;
    private String status;
    private LocalDateTime createdAt;
    private String network;
    private String walletAddress;
    
}