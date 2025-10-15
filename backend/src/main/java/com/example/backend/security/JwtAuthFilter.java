package com.example.backend.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtil;
    private final UserDetailsService userDetailsService;

    //Recibe las peticiones HTTP y aplica el filtro
    @Override
    protected  void doFilterInternal(HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain)
        throws ServletException, IOException {
        logger.info(String.format(
                "Método: %s, URL: %s, Protocolo: %s",
                request.getMethod(),
                request.getRequestURI(),
                request.getProtocol()
        ));

        //Lee el header Authorization y si no empieza por Bearer lo ignora y deja pasar la peticion.
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extrae el token y el IdentityNumber
        final String jwt = authHeader.substring(7);
        String identityNumber = null;
        try {
            identityNumber = jwtUtil.extractIdentityNumber(jwt);
        } catch (Exception e) {
            logger.warn(String.format(
                    "Token inválido para request %s %s: %s",
                    request.getMethod(),
                    request.getRequestURI(),
                    e.getMessage()
            ));
        }

        //Verifica si el usuario no esta ya autenticado. Si no lo esta se continua con la validacion.
        if (identityNumber != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(identityNumber);

            if (jwtUtil.isTokenValid(jwt)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
