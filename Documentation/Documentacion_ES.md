# Documentacion de Quick-sqlite

Bienvenido a la seccion de documentacion te explicare que alcance tiene esta libreria por el momento y sintaxis de la misma

Quick-sqlite es una libreria ligera para Node.js basada en better-sqlite3, que facilita el uso de SQLite mediante una API simple y segura, ideal para proyectos pequeños o educativos.

## Formato de retorno

La mayoria de los metodos de **Quick-sqlite** retornan un objeto con la siguiente estructura:

```javascript
{
  success: boolean,   // indica si la operación fue exitosa
  message: string,    // mensaje informativo o de error
  list?: array        // resultados de la consulta (solo en SELECT)
}
```

Funciones que implementadas hasta el momento

- Connexion
- Table
- Insert
- Delete
- SelectAll
- Select
- SelectLike
- Update
- DropTable

### Tecnologias usadas

- Node.js
- SQLite
- better-sqlite3

## Limitantes

Aun no se integra los operadores aritmeticos y relacionales como: >, <, >=, <=

## Instalacion

Comando para instalar la libreria quick-sqlite

```bash
npm install quick-sqlite
```

### Seguridad

Todas las consultas utilizan **parámetros seguros**, evitando que los valores del usuario se inyecten directamente en la consulta SQL.  
Por ejemplo, en lugar de hacer esto:

```sql
SELECT * FROM users WHERE name = ' " + userInput + " ';
```

Hace esto:

```sql
SELECT * FROM users WHERE name = ?;
```

### Inicializacion / Conexion

Si no existe la base de datos la creara y si existe la buscara y la usara

```javascript
const sqlite = require("quick-sqlite");
// Esto inicializa la conexión a la base de datos
sqlite.Connexion("test.db");
```

Nota: La conexión se inicializa internamente y se usa para todas las demás funciones.

### Crear Tablas

```javascript
const usuarios = sqlite.Table({
  name: "usuarios",
  data: ["id INTEGER PRIMARY KEY AUTOINCREMENT", "name TEXT NOT NULL"],
});

// para mostrar mensaje de si se completo la consulta
console.log(usuarios);
```

Nota: Todas las tablas que vas a crear se les agrega el **IF NOT EXISTS** para evitar tener errores si realizas la consulta una segunda vez

### Insertar datos

```javascript
const usuario = sqlite.Insert({
  table: "usuarios",
  // notas que utilizaras deben de coincidir con el mismo tamaño que el array de entrada de datos
  columns: ["name"],
  data: ["alberto"],
});

console.log(usuario);
```

Nota: No es necesario declarar id en las columnas si en la tabla determinaste AUTOINCREMENT

### Eliminar dato de una tabla

```javascript
const eliminar = sqlite.Delete({
  table: "usuarios",
  where: ["id"],
  data: [1],
});

console.log(eliminar);
```

### SelectAll -> Seleccionar todo el contenido de una tabla

```javascript
const todos = sqlite.SelectAll({
  table: "usuarios",
});

console.log(todos);
```

Nota: Puedes recorrer el array que devuelve y puedes acceder a su propiedad y para que se vea mas ordenado

**Ejemplo**:

```javascript
if (todos.success) {
  for (const t of todos.list) {
    console.log(t.id, t.name);
  }
} else {
  console.error(todos.message);
}
```

Si existe contenido en la tabla retorna success y lista

### Select -> Seleccionar contenido especifico de una tabla

**Condicion OR**

```javascript
const datos = sqlite.Select({
  table: "usuarios",
  columns: ["id", "name"],
  where: ["name"],
  operator: "OR",
  data: [4, "alberto"],
});

console.log(datos);
```

Nota: Cuando usamos la condicion OR en el "where" si pasamos solo un parametro como en este caso "name" , todo lo que pasemos a data lo tomara para cumplir tu consulta

**Condicion AND**

Caso 1

```javascript
const datos = sqlite.Select({
  table: "usuarios",
  columns: ["name"],
  where: ["id", "name"],
  operator: "AND",
  data: [4, "alberto"],
});

console.log(datos);
```

Caso 2

```javascript
const datos = sqlite.Select({
  table: "usuarios",
  columns: ["name"],
  where: ["id", "name"],
  data: [4, "alberto"],
});

console.log(datos);
```

Nota: Cuando usemos la condicion AND existen dos caso o lo definimos o no, ¿porque no hace falta definir? no hace falta definir ya que por defecto estara en AND si no declaras el operator lo entendera como si colocaste AND

### SelectLike

Este metodo es para las consultas con condicion LIKE (puedes concatenar AND y OR)

```javascript
const query = sqlite.SelectLike({
  table: "usuarios",
  columns: ["id", "name"],
  where: ["name"],
  data: ["a%"],
});

console.log(ea);
```

Nota: El dato que pasamos en data debe ser de tipo String ya que las consultas LIKE realizan las busquedas mediante una cadena.

### Update

```javascript
// Actualiza la columna "name" a "alex"
// donde id = 3 AND name = "alberto"

const u = sqlite.Update({
  table: "usuarios",
  columns: ["name"],
  dataColumn: ["alex"], // aqui va el nuevo dato
  where: ["id", "name"], // una condicion , recuerda cuando esta sin declarar el operator se declara automaticamente AND
  dataCondition: [3, "alberto"], // datos ingresar a la condicion
});

console.log(u);
```

Nota:

1. columns y dataColumn deben tener la misma longitud
   ya que cada valor de dataColumn se asigna a su columna correspondiente
2. where define las columnas usadas como condicion
3. dataCondition contiene los valores para cada condicion en el mismo orden
4. Si no se especifica un operador logico, las condiciones en where se unen automaticamente con AND.

### DropTable

Funcion que nos permite eliminar la tabla completa de la base de datos

```javascript
const tabla = sqlite.DropTable({
  table: "usuarios",
});
```

Nota: Al momento de borrar la tabla sera de manera permanente
