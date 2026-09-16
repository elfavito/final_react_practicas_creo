import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.routers.deps import get_db
from app.core.seed import seed_initial_data


# Configurar base de datos SQLite en memoria para tests aislados
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_initial_data(session)
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def test_admin_login_with_favo(client: TestClient):
    """Verifica que el usuario admin pueda loguearse con 'favo' y 'Favo1010'."""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "favo", "password": "Favo1010"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "ADMIN"
    assert data["user"]["email"] == "favo@educart.com"


def test_student_login(client: TestClient):
    """Verifica el login del usuario cliente de prueba."""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "alumno@educart.com", "password": "Alumno1010"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "CLIENT"


def test_products_catalog_and_filters(client: TestClient):
    """Verifica el catálogo y el filtrado por texto y categoría."""
    # Listar todos (deben ser 15 sembrados)
    res_all = client.get("/api/v1/products")
    assert res_all.status_code == 200
    products = res_all.json()
    assert len(products) >= 15
    assert "stock_status" in products[0]

    # Filtro por búsqueda de texto
    res_search = client.get("/api/v1/products?search=Tablet")
    assert res_search.status_code == 200
    assert any("Tablet" in p["nombre"] for p in res_search.json())

    # Filtro por categoría
    res_cat = client.get("/api/v1/products?categoria=Tech%20Tools")
    assert res_cat.status_code == 200
    for p in res_cat.json():
        assert p["categoria"] == "Tech Tools"


def test_dashboard_endpoints_security_and_data(client: TestClient):
    """Verifica que los endpoints del Dashboard requieran ADMIN y devuelvan KPIs y gráficos."""
    # Token de estudiante
    res_student = client.post(
        "/api/v1/auth/login",
        data={"username": "alumno@educart.com", "password": "Alumno1010"}
    )
    student_token = res_student.json()["access_token"]

    # Acceso no autorizado como estudiante (debe dar 403)
    res_forbidden = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert res_forbidden.status_code == 403

    # Token de admin
    res_admin = client.post(
        "/api/v1/auth/login",
        data={"username": "favo", "password": "Favo1010"}
    )
    admin_token = res_admin.json()["access_token"]

    # Acceso exitoso a KPIs
    res_stats = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_stats.status_code == 200
    stats = res_stats.json()
    assert "ventas_del_mes" in stats
    assert "ordenes_pendientes" in stats
    assert "productos_en_alerta" in stats
    assert "valor_total_inventario" in stats

    # Acceso a Top Products (gráfico de barras)
    res_top = client.get(
        "/api/v1/dashboard/top-products",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_top.status_code == 200
    top = res_top.json()
    assert len(top) > 0
    assert "total_vendido" in top[0]

    # Acceso a Category Distribution (gráfico de torta)
    res_dist = client.get(
        "/api/v1/dashboard/category-distribution",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_dist.status_code == 200
    dist = res_dist.json()
    assert len(dist) > 0
    assert "categoria" in dist[0]
    assert "total" in dist[0]


def test_atomic_checkout_and_rollback(client: TestClient):
    """Verifica la transacción atómica: éxito decrementa stock y falla hace rollback."""
    # Login estudiante
    res_login = client.post(
        "/api/v1/auth/login",
        data={"username": "alumno@educart.com", "password": "Alumno1010"}
    )
    token = res_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Producto 1 tiene stock inicial 12
    p1_initial = client.get("/api/v1/products/1").json()
    stock_before = p1_initial["stock_actual"]

    # Compra exitosa de 2 unidades
    res_order = client.post(
        "/api/v1/orders",
        json={
            "shipping_address": "Campus Universitario Pabellón 2",
            "items": [
                {"product_id": 1, "cantidad": 2, "precio_unitario": p1_initial["precio"]}
            ]
        },
        headers=headers
    )
    assert res_order.status_code == 201

    # Verificar que el stock disminuyó en 2
    p1_after = client.get("/api/v1/products/1").json()
    assert p1_after["stock_actual"] == stock_before - 2

    # Intentar comprar más unidades del producto 10 (stock agotado = 0) -> Falla y Rollback
    res_fail = client.post(
        "/api/v1/orders",
        json={
            "shipping_address": "Laboratorio",
            "items": [
                {"product_id": 10, "cantidad": 5, "precio_unitario": 35.0}
            ]
        },
        headers=headers
    )
    assert res_fail.status_code == 400
    assert "Stock insuficiente" in res_fail.json()["detail"]

    # Verificar que las órdenes del usuario incluyen la compra
    res_my_orders = client.get("/api/v1/orders/my-orders", headers=headers)
    assert res_my_orders.status_code == 200
    orders = res_my_orders.json()
    assert len(orders) >= 1
