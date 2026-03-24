import  jwtDecode  from 'jwt-decode';
import Cookies from 'js-cookie';

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token);
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  getToken() {
    return Cookies.get('id_token');
  }

  login(idToken) {
    Cookies.set('id_token', idToken, { expires: 1 });
    window.location.assign('/');
  }

  logout() {
    Cookies.remove('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();