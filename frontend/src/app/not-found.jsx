// Custom 404 error page for handling non-existent routes
export default function NoEncontrada() {
    return (
        <div className="container text-center">
            <h1 className="display-4 text-danger">Error 404</h1>
            <p className="lead">Página no encontrada</p>
        </div>
    );
}