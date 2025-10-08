package com.example.backend.controller;
import com.example.backend.dtos.HistoryDTO;
import com.example.backend.dtos.ParkingMapDTO;
import com.example.backend.dtos.ParkingRequestDTO;
import com.example.backend.models.Parking;
import com.example.backend.service.AuthService;
import com.example.backend.service.ParkingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/parkings")
public class ParkingsController {
    private final ParkingsService parkingsService;

    @Autowired
    public ParkingsController(ParkingsService parkingsService) {
        this.parkingsService = parkingsService;
    }

    @GetMapping
    public List<Parking> getAllParkings(){
        return parkingsService.findAllParkings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parking> getParkingsById(@PathVariable Long id){
        Optional<Parking> parkings = parkingsService.findParkingsById(id);
        return parkings.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/history/user/{plateId}")
    public List<HistoryDTO> getParkingHistoryByUserId(@PathVariable Long plateId){
        Long userId = AuthService.getAuthenticatedUser().getId();

        return parkingsService.getParkingHistoryByUserId(userId, plateId);
    }

    @GetMapping("/history/last-three")
    public List<HistoryDTO> getLast3Distinct() {
        Long userId = AuthService.getAuthenticatedUser().getId();
        return parkingsService.getLast3DistinctParkings(userId);
    }

    @GetMapping("/about-to-finish/map")
    public List<ParkingMapDTO> getParkingsAboutToFinish(){
        return parkingsService.getParkingsAboutToFinish();
    }

    @PostMapping("/create")
    public Parking create(@RequestBody ParkingRequestDTO ParkingRequestDTO) {
        return parkingsService.createParking(ParkingRequestDTO);
    }

    @PostMapping("/finish/{id}")
    public Parking finish(@PathVariable Long id){
        return parkingsService.finishParking(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        parkingsService.delete(id);
        return ResponseEntity.noContent().build();
    }

}

/*
Deberia cambiar los entrypoint con userId, no son muy seguros.
Se puede usar algo como lo que esta implementado en FcmTokenController
La autenticacion del usuario se puede hacer desde el mismo token que llega en la request.
 */