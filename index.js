const Database = require("better-sqlite3");
// traemos la funciones que validaran nuestros paremetros
const { validate, arr, strings, lengths } = require("./validations.js");

// creamos una conexion que iniciara en null ya que no se a creado nada
// esto lo hacemos para poder guardar la conexion y el usuario no tenga que escribirla

let conexion = null;

// funcion para conectarnos a la base de datos
function Connexion(path) {
  // si aun no hay conexion guardada
  if (!conexion) {
    // creamos la db o si existe usarla y la guardarmos en conexion
    conexion = new Database(path);
    console.log("Database is ready");
    return conexion;
  } else {
    throw new Error(
      "An error occurred while trying to connect to the database."
    );
  }
}

// creacion de tablas las cuales todas seran unicas por si se ejecuta mas de una vez y da error
function Table({ name, data = [] }) {
  // validamos si es un array y el nombre esta bien escrito
  validate(name);
  strings(name);
  arr(data);

  // cada dato que ingrese sera concatenado por una coma
  const query = `CREATE TABLE IF NOT EXISTS ${name} (${data.join(", ")})`;
  try {
    conexion.prepare(query).run();
    console.log("Successe query");
    // retornaremos mensajes de que si se completo o no
    return {
      sucess: true,
    };
  } catch (error) {
    return {
      sucess: false,
      message: error,
    };
  }
}

// funcion para insertar datos mediante columnas y los datos que ingrese
function Insert({ table, columns = [], data = [] }) {
  // chequeo de variables
  validate(table);
  strings(table);
  arr(data);
  arr(columns);

  for (const col of columns) {
    strings(col);
  }

  // para evitar inyecciones sqlite
  const incognite = data.map(() => "?").join(", ");
  const query = `INSERT INTO ${table} (${columns}) VALUES(${incognite})`;

  try {
    conexion.prepare(query).run(...data);
    console.log("Successe query");
    // retornaremos mensajes de que si se completo o no
    return {
      sucess: true,
    };
  } catch (error) {
    return {
      sucess: false,
      message: error,
    };
  }
}

// funcion para eliminar datos de una tabla
function Delete({ table, where = [], operator, data = [] }) {
  validate(table);
  strings(table);
  arr(data);
  arr(where);
  lengths(where, data);
  for (const condition of where) {
    strings(condition);
  }

  // nuestro operador puede ser tanto como AND , OR y indefiido

  let conditions;

  // version mas organizada que la idea anterior de abajo
  switch (operator) {
    case "AND":
      conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
      break;
    case undefined:
      conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
      break;
    case "OR":
      conditions = where.map((wh) => `${wh} = ?`).join(" OR ");
      break;
    default:
      throw new Error("Error only accepts condition OR , AND");
  }

  //if (operator === "AND" || operator === undefined) {
  //  conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
  //}
  //
  //if (operator === "OR") {
  //  conditions = where.map((wh) => `${wh} = ?`).join(" OR ");
  //}
  //
  //if (operator !== "AND" && operator !== "OR" && operator !== undefined) {
  //  throw new Error("No se permite ingresar otro tipo de condicion");
  //}

  // esto permite concatenar varios condiciones dentro del delete
  const query = `DELETE FROM ${table} WHERE ${conditions} `;

  try {
    conexion.prepare(query).run(...data);
    return {
      sucess: true,
    };
  } catch (error) {
    return {
      sucess: false,
      message: error,
    };
  }
}

// funcion para mostrar todo el contenido de la tabla
function ShowAll({ table }) {
  validate(table);
  strings(table);
  const query = `SELECT * FROM ${table}`;

  try {
    // regresamos la lista obtenida de la consulta
    const lista = conexion.prepare(query).all();
    return {
      success: true,
      list: lista,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}
// mostrar dato especifico de una tabla

function Show({ table, columns = [], data = [], where = [], operator }) {
  // chequeo de parametros
  strings(table);
  validate(table);
  arr(columns); // si lo que envia el usuario es una array
  arr(data); // si lo que envia el usuario es una array
  arr(where); // si lo que envia el usuario es una array
  lengths(data, where); // si son del mismo tamañp
  // permitir varias condiciones

  // nuestro operador puede ser tanto como AND , OR y indefiido

  let conditions;

  // version mas organizada que la idea anterior de abajo
  switch (operator) {
    case "AND":
      conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
      break;
    case undefined:
      conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
      break;
    case "OR":
      conditions = where.map((wh) => `${wh} = ?`).join(" OR ");
      break;
    default:
      throw new Error("Error only accepts condition OR , AND");
  }

  const query = `SELECT ${columns} FROM ${table} WHERE ${conditions}`;

  try {
    const lista = conexion.prepare(query).get(...data);
    // si no existe indica que no hau coincidencias

    let mensaje = "Matches found";
    if (lista === undefined) {
      mensaje = "No matches were found";
    }
    return {
      success: true,
      list: lista,
      message: mensaje,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

/*
sintaxis test 

UPDATE ${tabla} SET $(columns) WHERE ${condition}

conn.Update({
  table : "ejemplo",
  columns : ["nombre" , "activo"],
  dataColumn : ["gustavo" , 1],
  where : ["id"],
  dataCondition : [1]
})


*/
// funcion para actualizar datos de una tabla
// necesitamos 4 arrays para la comprobacion de datos
function Update({
  table,
  columns = [],
  dataColumn = [],
  where = [],
  operator,
  dataCondition = [],
}) {
  validate(table); // si el nombre es valido => cumple el regex
  strings(table); // si es string
  // si son arrays
  arr(columns);
  arr(where);
  arr(dataColumn), arr(dataCondition);
  // verificar el tamaño sea igual
  lengths(columns, dataColumn);
  lengths(where, dataCondition);

  // verificar si es string cada dato ingresado
  for (const col of columns) {
    strings(col);
  }
  for (const wh of where) {
    strings(wh);
  }

  // para evitar que la actualizacion de la consulta cometas un error
  // tiene que ser de manera estricta
  if (where.length === 0) {
    throw new Error("UPDATE without WHERE is not allowed");
  }

  // nuestro operador puede ser tanto como AND , OR y indefiido

  let conditions;

  // version mas organizada que la idea anterior de abajo
  switch (operator) {
    case "AND":
      conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
      break;
    case undefined:
      conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
      break;
    case "OR":
      conditions = where.map((wh) => `${wh} = ?`).join(" OR ");
      break;
    default:
      throw new Error("Error only accepts condition OR , AND");
  }

  // evitar inyecciones sqlite
  const condition1 = columns.map((col) => `${col} = ? `).join(", ");

  const query = `UPDATE ${table} SET ${condition1} WHERE ${conditions}`;

  try {
    conexion.prepare(query).run([...dataColumn, ...dataCondition]);
    return {
      success: true,
      message: "Successe query",
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}

module.exports = {
  Connexion,
  Table,
  Insert,
  Delete,
  ShowAll,
  Show,
  Update,
};
