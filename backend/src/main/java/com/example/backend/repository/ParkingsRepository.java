package com.example.backend.repository;
import com.example.backend.models.Parkings;
import com.example.backend.models.enums.ParkingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingsRepository extends JpaRepository<Parkings, Long> {
    List<Parkings> findByUser_Id (Long userId);

    List<Parkings> findByPlate_Id (Long plateId);

    List<Parkings> findByStatus (ParkingStatus status);

}


