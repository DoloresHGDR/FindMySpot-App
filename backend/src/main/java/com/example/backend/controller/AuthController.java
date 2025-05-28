package com.example.backend.controller;
import com.example.backend.dtos.JwtResponse;
import com.example.backend.dtos.LoginRequestDTO;
import com.example.backend.dtos.RegisterUserDTO;
import com.example.backend.security.JwtUtils;
import com.example.backend.security.UserDetailsImpl;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final UserDetailsService userDetailsService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, UserService userService, UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public JwtResponse authenticateUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getIdentityNumber(),
                        loginRequestDTO.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails.getUsername());
        return new JwtResponse(jwt);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserDTO registerUserDTO) {
        try {
            userService.saveUser(registerUserDTO);

            UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(registerUserDTO.getIdentityNumber());
            String jwt = jwtUtils.generateToken(userDetails.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("El usuario con este DNI ya existe.");
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error al registrar el usuario.");
        }
    }

}
