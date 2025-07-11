# API de Superhéroes 🦸‍♂️

Una API RESTful desarrollada en Node.js para gestionar información de superhéroes.

## 🚀 Características

- CRUD completo para superhéroes
- Validación de datos con express-validator
- Arquitectura en capas (Controllers, Services, Repositories)
- Manejo de errores robusto
- API RESTful siguiendo mejores prácticas

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 🛠️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd api-superheroes
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta la aplicación**
   ```bash
   npm start
   ```

## 📦 Dependencias

- **express**: Framework web para Node.js
- **express-validator**: Validación de datos de entrada
- **fs-extra**: Utilidades mejoradas para manejo de archivos

## 🏗️ Estructura del Proyecto

```
api-superheroes/
├── app.js                 # Punto de entrada de la aplicación
├── controllers/           # Controladores de la API
│   └── heroControllers.js
├── models/               # Modelos de datos
│   └── heroModel.js
├── repositorios/         # Capa de acceso a datos
│   └── heroRepository.js
├── services/             # Lógica de negocio
│   └── heroService.js
├── superheroes.json      # Base de datos JSON
├── package.json          # Configuración del proyecto
└── README.md            # Documentación
```

## 🔧 Scripts Disponibles

- `npm start`: Inicia la aplicación
- `npm test`: Ejecuta las pruebas (pendiente de implementar)

## 📡 Endpoints de la API

### Superhéroes

- `GET /api/heroes` - Obtener todos los superhéroes
- `GET /api/heroes/:id` - Obtener un superhéroe por ID
- `POST /api/heroes` - Crear un nuevo superhéroe
- `PUT /api/heroes/:id` - Actualizar un superhéroe
- `DELETE /api/heroes/:id` - Eliminar un superhéroe

## 📝 Ejemplo de Uso

### Crear un superhéroe
```bash
curl -X POST http://localhost:3000/api/heroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spider-Man",
    "powers": ["Super fuerza", "Sentido arácnido"],
    "origin": "Marvel Comics"
  }'
```

### Obtener todos los superhéroes
```bash
curl http://localhost:3000/api/heroes
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado con ❤️ usando Node.js y Express. 