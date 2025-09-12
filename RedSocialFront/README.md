<!-- 

📌 Red Social - Proyecto Fullstack (MERN)
Una red social moderna desarrollada con MongoDB, Express, React y Node.js (MERN), que permite a los usuarios registrarse, iniciar sesión, crear publicaciones, interactuar con likes y comentarios, y conectarse con otros usuarios mediante sistema de seguidores.

-------------------------------------
✨ Funcionalidades principales
-------------------------------------

Autenticación de usuarios:

- Registro con validación.
- Login con JWT y hash de contraseñas con bcrypt.
- Cierre de sesión seguro.
- Gestión de perfil
- Ver datos personales y posts propios.
- Subir/editar avatar.
- Editar username, email y biografía.
- Cambiar contraseña.
- Contadores de seguidores y seguidos.
- Listado de seguidores y seguidos.
- Ver posts a los que se ha dado like.


Publicaciones (Posts):

- Crear, editar y eliminar publicaciones.
- Subir imágenes en los posts.
- Ver todas las publicaciones o las de un usuario en particular.
- Like / Unlike en tiempo real.
- Buscador por título de post.


Comentarios:

- Añadir comentarios en publicaciones.
- Editar y eliminar solo tus comentarios.
- Likes en comentarios.


✅ Red social:

Seguir o dejar de seguir a otros usuarios.
Ver número de seguidores y seguidos.
Navegar por los perfiles.


✅ Extras:

Responsive (móvil, tablet, escritorio).
Guards para rutas protegidas.
Buscador de usuarios y posts.
Estilo moderno con colores azules profesionales.
Preparado para despliegue en Vercel / AWS / Heroku.


🛠️ Tecnologías utilizadas

Frontend
React 18 + Vite ⚡
Redux Toolkit (gestión de estado global)
React Router
SCSS Modules
Axios (peticiones HTTP)
Backend
Node.js + Express
MongoDB + Mongoose
JWT (autenticación)
Bcrypt.js (hash de contraseñas)
Multer (subida de imágenes)
Dotenv (variables de entorno)
CORS habilitado


🚀 Instalación y ejecución

1. Clonar el repositorio:
    git clone https://github.com/tuusuario/red-social.git
    cd red-social

2. Configurar el backend:
    cd Backend
    npm install

3.Crear un archivo .env en la carpeta Backend con:
    MONGO_URI=mongodb://localhost:27017/redsocial
    JWT_SECRET=tu_clave_secreta
    PORT=3000

4.Ejecutar el servidor:
    npm run dev


👉 El backend correrá en http://localhost:3000
Configurar el frontend
    cd ../Frontend
    npm install
    npm run dev

👉 El frontend correrá en http://localhost:5173

📂 Estructura del proyecto
red-social/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── styles/
│   │   └── App.jsx
│   └── vite.config.js
└── README.md


🧪 Tests
Puedes probar las rutas del backend con Postman / Insomnia:

- POST /users/register → Registro
- POST /users/login → Login
- GET /posts → Listar posts
- POST /posts → Crear post (requiere token)
- POST /posts/:id/like → Dar like a un post


📌 Futuras mejoras:
- Chat en tiempo real con Socket.IO.
- Notificaciones push.
- Stories al estilo Instagram.
- Mejoras en accesibilidad y SEO.


👨‍💻 Autor:
Desarrollado por Josune Rodríguez Gomez
💼 GitHub: https://github.com/JosuneRG/BBK43_RedSocial_Front.git
📧 Email: josunerg94@gmail.com -->