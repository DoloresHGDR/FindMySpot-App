package com.example.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {

    private final int jwtExpirationMs;
    private final Key key;

    public JwtUtils(@Value("${jwt.secret}") String jwtSecret,
                    @Value("${jwt.expiration.ms}") int jwtExpirationMs) {
        this.jwtExpirationMs = jwtExpirationMs;
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    //Generacion del token JWT
    public String generateToken(String identityNumber) {
        return Jwts.builder()
                .setSubject(identityNumber)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extraccion de informacion del token
    public String extractIdentityNumber(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Este es un metodo generico para extraer cualquier claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = parseClaims(token);
        return claimsResolver.apply(claims);
    }

    // Esto valida el token por expiracion del tiempo
    public boolean isTokenValid(String token) {
        Claims claims = parseClaims(token);
        return claims != null && claims.getExpiration().after(new Date());
    }

    //Esto parsea y valida el token
    public Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            return null;
        }
    }
}
