# Simple sqlite

Una forma mas sencilla de realizar consultas SQLITE en Nodejs

## Instalacion

```bash
npm install simple-sqlite
```

## Documentacion

Para aprender como se usa esta libreria da click aqui para ver la documentacion en español [Documentacion](./Documentation/Documentacion_ES.md)
To learn how to use this library, click here to view the documentation in English [Documentacion](./Documentation/Documentation_EN.md)

## Caracteristicas

    - Crear consultas SQLite fácilmente.
    - Compatible con Node.js >=18.
    - Soporte para `better-sqlite3` como motor
    - Evita inyecciones SQL usando parámetros seguros.

## Ejemplo de uso

```javascript
const conn = require("simple-sqlite");
conn.Connexion("test.db");

const consulta = conn.SelectLike({
  table: "alumnos",
  columns: ["id", "name"],
  where: ["name"],
  data: ["C%"],
});

console.log(consulta);
```

## Licencia

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Autor

- [@Gxtavo-dev](https://www.github.com/Gxstavo-dev)
