from sqlmodel import Session, select
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.order import Order, OrderItem, OrderStatus
from app.core.security import get_password_hash


def seed_initial_data(session: Session) -> None:
    """
    Siembra datos iniciales (Admin, Cliente de prueba, 15 productos educativos y orden demo)
    si la base de datos se encuentra vacía.
    """
    # 1. Verificar si ya existen usuarios o productos
    existing_user = session.exec(select(User)).first()
    existing_product = session.exec(select(Product)).first()

    admin_user = None
    client_user = None

    if not existing_user:
        # Admin: usuario "favo" / clave "Favo1010"
        admin_user = User(
            email="favo@educart.com",
            hashed_password=get_password_hash("Favo1010"),
            full_name="Favo Admin",
            role=UserRole.ADMIN,
            is_active=True,
        )
        session.add(admin_user)

        # Cliente demo: alumno@educart.com / Alumno1010
        client_user = User(
            email="alumno@educart.com",
            hashed_password=get_password_hash("Alumno1010"),
            full_name="Estudiante EduCart",
            role=UserRole.CLIENT,
            is_active=True,
        )
        session.add(client_user)
        session.commit()
        session.refresh(admin_user)
        session.refresh(client_user)

    is_legacy = existing_product and existing_product.categoria not in ["Tech Tools", "Study Materials", "Robotics & Hardware"]

    if not existing_product or is_legacy:
        products_data = [
            {
                "sku": "TAB-EDU-01",
                "nombre": "Tablet Educativa EduTab 10\" HD",
                "descripcion": "Tablet diseñada para estudiantes y lectura técnica con pantalla antirreflejo y batería de 7000mAh.",
                "precio": 189.99,
                "categoria": "Tech Tools",
                "rating": 4.8,
                "stock_actual": 12,
                "stock_minimo": 5,
                "opciones": {"color": ["Gris Espacial", "Azul Marino"], "almacenamiento": ["64GB", "128GB"]}
            },
            {
                "sku": "CALC-FX-991",
                "nombre": "Calculadora Científica Pro FX-991",
                "descripcion": "Calculadora con 552 funciones matemáticas, cálculo matricial y pantalla de alta resolución.",
                "precio": 39.50,
                "categoria": "Tech Tools",
                "rating": 4.9,
                "stock_actual": 25,
                "stock_minimo": 10,
                "opciones": {"color": ["Negro", "Blanco"]}
            },
            {
                "sku": "ROB-STEAM-01",
                "nombre": "Kit Robótica Educativa STEAM Starter",
                "descripcion": "Kit de inicio con chasis robótico, servomotores y sensores programables en Scratch y Python.",
                "precio": 145.00,
                "categoria": "Robotics & Hardware",
                "rating": 4.7,
                "stock_actual": 8,
                "stock_minimo": 3,
                "opciones": {"nivel": ["Básico", "Avanzado"]}
            },
            {
                "sku": "CUAD-UNIV-04",
                "nombre": "Set de Cuadernos Universitarios Premium x3",
                "descripcion": "Cuadernos de 100 hojas con papel de 90g resistente a tintas y encuadernación reforzada.",
                "precio": 14.99,
                "categoria": "Study Materials",
                "rating": 4.6,
                "stock_actual": 50,
                "stock_minimo": 15,
                "opciones": {"rayado": ["Cuadriculado", "Rayado", "Punteado"]}
            },
            {
                "sku": "PEN-STY-05",
                "nombre": "Lápiz Óptico Digital Smart Stylus Pen",
                "descripcion": "Stylus de precisión con rechazo de palma y carga rápida USB-C para tomar apuntes y esquemas.",
                "precio": 29.99,
                "categoria": "Tech Tools",
                "rating": 4.5,
                "stock_actual": 4,  # Alerta: <= stock_minimo
                "stock_minimo": 5,
                "opciones": {"color": ["Blanco", "Negro"]}
            },
            {
                "sku": "MCU-IOT-06",
                "nombre": "Placa Microcontrolador EduBoard IoT WiFi",
                "descripcion": "Placa de desarrollo con conectividad WiFi y Bluetooth, ideal para proyectos académicos de IoT.",
                "precio": 24.50,
                "categoria": "Robotics & Hardware",
                "rating": 4.8,
                "stock_actual": 3,  # Alerta
                "stock_minimo": 5,
                "opciones": {"pines": ["Soldados", "Sin Soldar"]}
            },
            {
                "sku": "MOCH-ERG-07",
                "nombre": "Mochila Ergonómica Estudiantil Waterproof",
                "descripcion": "Compartimiento acolchado para laptop de hasta 15.6 pulgadas y puerto de carga externo.",
                "precio": 49.00,
                "categoria": "Study Materials",
                "rating": 4.7,
                "stock_actual": 18,
                "stock_minimo": 5,
                "opciones": {"color": ["Gris", "Azul", "Negro"]}
            },
            {
                "sku": "MARC-PAST-08",
                "nombre": "Set de Resaltadores y Marcadores Pasteles x12",
                "descripcion": "Tinta a base de agua sin traspasar hojas, colores suaves óptimos para técnica de estudio activa.",
                "precio": 12.50,
                "categoria": "Study Materials",
                "rating": 4.9,
                "stock_actual": 40,
                "stock_minimo": 10,
                "opciones": {"paleta": ["Pastel Clásico", "Neón"]}
            },
            {
                "sku": "HEAD-ANC-09",
                "nombre": "Auriculares ANC para Estudio y Concentración",
                "descripcion": "Cancelación de ruido activa, micrófono integrado y hasta 40 horas de reproducción continua.",
                "precio": 79.99,
                "categoria": "Tech Tools",
                "rating": 4.6,
                "stock_actual": 7,
                "stock_minimo": 5,
                "opciones": {"color": ["Negro", "Plata"]}
            },
            {
                "sku": "SENS-KIT-10",
                "nombre": "Kit Sensores 37 en 1 para Arduino y ESP32",
                "descripcion": "Módulos de temperatura, distancia ultrasónica, giroscopio y luz para laboratorio de electrónica.",
                "precio": 35.00,
                "categoria": "Robotics & Hardware",
                "rating": 4.8,
                "stock_actual": 0,  # Agotado!
                "stock_minimo": 5,
                "opciones": {"estuche": ["Caja Plástica Organizadora"]}
            },
            {
                "sku": "LIB-FIS-11",
                "nombre": "Libro Física Universitaria Sears & Zemansky",
                "descripcion": "Edición académica indispensable para carreras de ingeniería y ciencias exactas.",
                "precio": 65.00,
                "categoria": "Study Materials",
                "rating": 4.9,
                "stock_actual": 15,
                "stock_minimo": 5,
                "opciones": {"volumen": ["Volumen 1", "Volumen 2"]}
            },
            {
                "sku": "TERM-ACER-12",
                "nombre": "Botella Térmica Estudiantil 750ml Acero Inox",
                "descripcion": "Doble pared de aislamiento al vacío, mantiene líquidos fríos 24h o calientes 12h.",
                "precio": 18.00,
                "categoria": "Study Materials",
                "rating": 4.5,
                "stock_actual": 22,
                "stock_minimo": 5,
                "opciones": {"color": ["Verde Militar", "Negro Mate", "Azul"]}
            },
            {
                "sku": "MICR-DIG-13",
                "nombre": "Microscopio Digital USB 1000x HD",
                "descripcion": "Conexión directa a PC o tablet, luz LED regulable y captura de video para proyectos de biología.",
                "precio": 55.00,
                "categoria": "Tech Tools",
                "rating": 4.7,
                "stock_actual": 2,  # Alerta
                "stock_minimo": 3,
                "opciones": {"soporte": ["Metálico Articulado"]}
            },
            {
                "sku": "SET-DIB-14",
                "nombre": "Set Técnico de Dibujo, Escuadras y Compás",
                "descripcion": "Instrumentos de precisión milimetrada para dibujo técnico, arquitectura y diseño.",
                "precio": 16.50,
                "categoria": "Study Materials",
                "rating": 4.4,
                "stock_actual": 30,
                "stock_minimo": 8,
                "opciones": {"estuche": ["Funda Rígida"]}
            },
            {
                "sku": "ARM-ROB-15",
                "nombre": "Brazo Robótico Programable 4-DOF Educativo",
                "descripcion": "Estructura acrílica cortada por láser con servomotores para aprendizaje cinemático y robótica.",
                "precio": 89.00,
                "categoria": "Robotics & Hardware",
                "rating": 4.9,
                "stock_actual": 6,
                "stock_minimo": 3,
                "opciones": {"control": ["Bluetooth", "Joystick Analógico"]}
            },
        ]

        if is_legacy:
            for oi in session.exec(select(OrderItem)).all():
                session.delete(oi)
            for ord in session.exec(select(Order)).all():
                session.delete(ord)
            for p in session.exec(select(Product)).all():
                session.delete(p)
            session.commit()

        created_products = []
        for p_data in products_data:
            prod = Product(**p_data)
            session.add(prod)
            created_products.append(prod)

        session.commit()
        for prod in created_products:
            session.refresh(prod)

        # 3. Crear una orden demo inicial si tenemos usuario cliente y productos
        user_for_order = client_user or session.exec(select(User).where(User.role == UserRole.CLIENT)).first()
        if user_for_order and created_products:
            order = Order(
                user_id=user_for_order.id,
                status=OrderStatus.PAID,
                shipping_address="Av. Educación 1234, CABA - Estudiante Demo",
                total_amount=round(created_products[0].precio * 1 + created_products[1].precio * 2, 2),
            )
            session.add(order)
            session.commit()
            session.refresh(order)

            item1 = OrderItem(
                order_id=order.id,
                product_id=created_products[0].id,
                cantidad=1,
                precio_unitario=created_products[0].precio
            )
            item2 = OrderItem(
                order_id=order.id,
                product_id=created_products[1].id,
                cantidad=2,
                precio_unitario=created_products[1].precio
            )
            session.add(item1)
            session.add(item2)
            session.commit()
