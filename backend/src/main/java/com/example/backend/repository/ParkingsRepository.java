package com.example.backend.repository;
import com.example.backend.models.Parkings;
import com.example.backend.models.enums.ParkingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingsRepository extends JpaRepository<Parkings, Long> {
    List<Parkings> findByStatus (ParkingStatus status);

    @Query(
            value = "SELECT p.* " +
                    "FROM ( " +
                    "   SELECT DISTINCT ON (address) * " +
                    "   FROM parkings " +
                    "   WHERE user_id = :userId " +
                    "   ORDER BY address, start_time DESC " +
                    ") p " +
                    "ORDER BY p.start_time DESC " +
                    "LIMIT 3",
            nativeQuery = true
    )
    List<Parkings> findLast3DistinctByAddress(@Param("userId") Long userId);
    List<Parkings> findByUserIdAndPlateIdOrderByStartTimeDesc(Long userId, Long plateId);
}


