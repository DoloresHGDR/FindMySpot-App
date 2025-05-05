package com.example.backend.controller;
import com.example.backend.models.Parkings;
import com.example.backend.service.ParkingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("api/parkings")
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

    @PostMapping
    public Parkings save(@RequestBody Parkings parkings) {
        return parkingsService.save(parkings);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        parkingsService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
