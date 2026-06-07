# Autosuficiencia Los Chillos

Blog comunitario del Centro de Recursos y Autosuficiencia Los Chillos. Sitio web estático desplegado en **AWS Amplify**. Cada vez que haces `git push` a la rama `main`, el sitio se actualiza automáticamente.

## Estructura del proyecto

```
/
├── index.html              # Página principal (carrusel + contenido reciente)
├── single.html             # Plantilla de artículo (?id=X)
├── favicon.png             # Icono de pestaña del navegador
├── amplify.yml             # Configuración de AWS Amplify
├── data/
│   └── articulos.json      # Todos los artículos del blog
├── images/                 # Imágenes (530×351 píxeles)
├── css/
│   └── style.css
├── js/
│   └── scripts.js          # Carga dinámica de artículos y búsqueda
├── paginas/                # Páginas de secciones
│   ├── educacion.html
│   ├── empleo.html
│   ├── emprender.html
│   ├── medicina.html
│   ├── testimonios.html
│   ├── quienes-somos.html
│   └── contactos.html
├── qa-tests/               # Pruebas automatizadas (YAML)
└── Readme.txt
```

## Cómo agregar un artículo nuevo

1. **Abrir** `data/articulos.json`
2. **Agregar** una nueva entrada al array siguiendo el formato de las existentes (asignar un `id` numérico nuevo)
3. **Agregar imagen** en la carpeta `images/` (debe medir **530×351 píxeles**)
4. **Hacer commit y push** para desplegar automáticamente

### Campos del artículo

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | número | sí | Identificador único |
| `titulo` | texto | sí | Título del artículo |
| `fecha` | texto | sí | Fecha de publicación |
| `resumen` | texto | sí | Texto corto que aparece en "Contenido reciente" |
| `contenido` | HTML | sí | Contenido completo del artículo (etiquetas HTML permitidas) |
| `imagen` | texto | sí | Ruta a la imagen (`images/archivo.jpg`) |
| `categoria` | texto | sí | educacion, empleo, emprender, medicina, noticias |
| `destacado` | booleano | sí | `true` = aparece en el carrusel; `false` = aparece solo en "Contenido reciente" |
| `informacion` | texto | no | URL opcional. Si se incluye, se muestra un recuadro azul con "Para más información" |

### Ejemplo

```json
{
  "id": 11,
  "titulo": "Título del artículo",
  "fecha": "Jun 7, 2026",
  "resumen": "Resumen breve para la página principal.",
  "contenido": "<p>Contenido completo aquí.</p>",
  "imagen": "images/mi-imagen.jpg",
  "categoria": "educacion",
  "destacado": true,
  "informacion": "https://ejemplo.com"
}
```

## Imágenes

Todas las imágenes deben redimensionarse a **530×351 píxeles** antes de agregarlas al proyecto. Usa cualquiera de estas herramientas gratuitas:

- **Adobe Express:** https://www.adobe.com/express/feature/image/resize
- **Simple Image Resizer:** https://www.simpleimageresizer.com/upload

## Cómo editar o eliminar un artículo

- **Editar:** Modifica los campos en `data/articulos.json` y haz commit + push.
- **Eliminar:** Borra la entrada completa del JSON y el archivo de imagen de `images/`, luego haz commit + push.

## Desarrollo local

Para probar cambios antes de subirlos:

```bash
python3 -m http.server 3000
```

Abrir en el navegador: `http://localhost:3000/index.html`

## Despliegue

El sitio se despliega automáticamente en AWS Amplify al hacer `git push` a la rama `main`.

URL de producción: https://main.d3lo0zn2l3toh2.amplifyapp.com
