import jwtDecode from 'jwt-decode';

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

export function isTokenExpired(token: string): boolean {
    try {
        const decoded: JwtPayload = jwtDecode(token);
        if (!decoded.exp) return true;
        const now = Date.now()/1000;
        return decoded.exp < now;
    } catch (e) {
        return true
    }

    
}