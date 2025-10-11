package com.example.backend.controller;
import com.example.backend.dtos.HistoryDTO;
import com.example.backend.dtos.ParkingMapDTO;
import com.example.backend.dtos.ParkingRequestDTO;
import com.example.backend.models.Parking;
import com.example.backend.service.AuthService;
import com.example.backend.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/parkings")
public class ParkingController {
    private final ParkingService parkingService;

    @Autowired
    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping
    public List<Parking> getAllParkings(){
        return parkingService.findAllParkings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parking> getParkingsById(@PathVariable Long id){
        Optional<Parking> parkings = parkingService.findParkingsById(id);
        return parkings.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/history/user/{plateId}")
    public List<HistoryDTO> getParkingHistoryByUserId(@PathVariable Long plateId){
        Long userId = AuthService.getAuthenticatedUser().getId();

        return parkingService.getParkingHistoryByUserId(userId, plateId);
    }

    @GetMapping("/history/last-three")
    public List<HistoryDTO> getLast3Distinct() {
        Long userId = AuthService.getAuthenticatedUser().getId();
        return parkingService.getLast3DistinctParkings(userId);
    }

    @GetMapping("/about-to-finish/map")
    public List<ParkingMapDTO> getParkingsAboutToFinish(){
        return parkingService.getParkingsAboutToFinish();
    }

    @PostMapping("/create")
    public Parking create(@RequestBody ParkingRequestDTO ParkingRequestDTO) {
        return parkingService.createParking(ParkingRequestDTO);
    }

    @PostMapping("/finish/{id}")
    public Parking finish(@PathVariable Long id){
        return parkingService.finishParking(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        parkingService.delete(id);
        return ResponseEntity.noContent().build();
    }

}