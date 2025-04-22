function CerrarSesion() {
        localStorage.setItem('token', null);
        localStorage.removeItem('token');
        window.location.href = '/';
        return alert('La sesión ha sido cerrada :)');
}
export default CerrarSesion