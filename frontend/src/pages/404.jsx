import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>404 - Página no encontrada</h1>
            <p>Lo sentimos, la página que estás buscando no existe.</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
};

export default NotFoundPage;