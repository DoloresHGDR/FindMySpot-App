package com.example.backend.dtos;

import com.example.backend.models.VehicleDetails;

public record ValidationResponse(boolean valid, String message, VehicleDetails vehicleDetails) {}

