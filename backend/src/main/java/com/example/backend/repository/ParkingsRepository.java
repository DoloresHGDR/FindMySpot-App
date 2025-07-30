package com.example.backend.repository;
import com.example.backend.models.Parkings;
import com.example.backend.models.enums.ParkingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingsRepository extends JpaRepository<Parkings, Long> {
    List<Parkings> findByUserId (Long userId);
    List<Parkings> findByUserIdOrderByStartTimeDesc(Long userId);
    Page<Parkings> findByUserId(Long userId, Pageable pageable);

    List<Parkings> findByPlateId (Long plateId);

    List<Parkings> findByStatus (ParkingStatus status);

}


