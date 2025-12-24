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
    console.log("Base de datos creada");
    return conexion;
  } else {
    throw new Error("No hay conexion con la base de datos");
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
    console.log("Consulta realizada con exito");
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
    console.log("Consulta realizada con exito");
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
function Delete({ table, where = [], data = [] }) {
  validate(table);
  strings(table);
  arr(data);
  arr(where);
  lengths(where, data);
  for (const condition of where) {
    strings(condition);
  }

  // esto permite concatenar varios condiciones dentro del delete
  const conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
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

function Show({ table, columns = [], data = [], where = [] }) {
  // chequeo de parametros
  strings(table);
  validate(table);
  arr(columns); // si lo que envia el usuario es una array
  arr(data); // si lo que envia el usuario es una array
  arr(where); // si lo que envia el usuario es una array
  lengths(data, where); // si son del mismo tamañp
  // permitir varias condiciones
  const conditions = where.map((wh) => `${wh} = ?`).join(" AND ");
  const query = `SELECT ${columns} FROM ${table} WHERE ${conditions}`;

  try {
    const lista = conexion.prepare(query).get(...data);
    // si no existe indica que no hau coincidencias
    if (!lista.length > 0) console.log("No hay coincidencias");

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

  // evitar inyecciones sqlite
  const condition1 = columns.map((col) => `${col} = ? `).join(", ");
  const condition2 = where.map((wh) => `${wh} = ? `).join(" AND ");

  const query = `UPDATE ${table} SET ${condition1} WHERE ${condition2}`;

  try {
    conexion.prepare(query).run([...dataColumn, ...dataCondition]);
    return {
      success: true,
      message: "consulta con existe",
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
  Update
};
