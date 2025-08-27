package com.example.backend.controller;
import com.example.backend.dtos.HistoryDTO;
import com.example.backend.dtos.ParkingMapDTO;
import com.example.backend.dtos.ParkingRequestDTO;
import com.example.backend.models.Parkings;
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
    public List<Parkings> getAllParkings(){
        return parkingsService.findAllParkings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parkings> getParkingsById(@PathVariable Long id){
        Optional<Parkings> parkings = parkingsService.findParkingsById(id);
        return parkings.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/history/user")
    public List<HistoryDTO> getParkingHistoryByUserId(@RequestParam(name= "limit", required = false) Integer limit){
        Long userId = AuthService.getAuthenticatedUser().getId();
        return parkingsService.getParkingHistoryByUserId(userId, limit);
    }

    @GetMapping("/about-to-finish/map")
    public List<ParkingMapDTO> getParkingsAboutToFinish(){
        return parkingsService.getParkingsAboutToFinish();
    }

    @PostMapping("/create")
    public Parkings create(@RequestBody ParkingRequestDTO ParkingRequestDTO) {
        return parkingsService.createParking(ParkingRequestDTO);
    }

    @PostMapping("/finish/{id}")
    public Parkings finish(@PathVariable Long id){
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