package com.example.backend.repository;
import com.example.backend.models.Parking;
import com.example.backend.models.enums.ParkingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, Long> {
    List<Parking> findByStatus (ParkingStatus status);

    @Query(
            value = "SELECT p.* " +
                    "FROM ( " +
                    "   SELECT DISTINCT ON (address) * " +
                    "   FROM parking " +
                    "   WHERE user_id = :userId " +
                    "   ORDER BY address, start_time DESC " +
                    ") p " +
                    "ORDER BY p.start_time DESC " +
                    "LIMIT 3",
            nativeQuery = true
    )
    List<Parking> findLast3DistinctByAddress(@Param("userId") Long userId);
    List<Parking> findByUserIdAndPlateIdOrderByStartTimeDesc(Long userId, Long plateId);
}


