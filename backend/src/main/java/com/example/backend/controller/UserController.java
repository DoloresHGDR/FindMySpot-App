package com.example.backend.controller;
import com.example.backend.dtos.LoginRequestDTO;
import com.example.backend.dtos.LoginResponseDTO;
import com.example.backend.dtos.RegisterUserDTO;
import com.example.backend.models.Users;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Optional<Users> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    /*
    @PostMapping("/register")
        public ResponseEntity<LoginResponseDTO> registerUser(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        try {
            LoginResponseDTO response = userService.saveUser(registerUserDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            LoginResponseDTO response = userService.loginUser(loginRequestDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
}

