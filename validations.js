// validacion de nombres para el nombre de las tablas para evitar inyecciones sql
function validate(name) {
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error("No cumple con los requisitos para el nombre de la tabla");
  }
}
// validacion para checar si son tipo string lo ingresado por el usuario
function strings(text) {
  if (!text || typeof text !== "string") {
    throw new Error("No es un string");
  }
}
// validacion para checar si son tipo array lo ingresado por el usuario

function arr(arrays) {
  if (!arrays || !Array.isArray(arrays)) {
    throw new Error("No es un array");
  }
}
// validacion para checar si dos arrays tienen la misma longitud

function lengths(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error("No son del mismo tamaño");
  }
}

function validationLike(text) {
  if (!/^[%a-zA-Z0-9]*$/.test(text)) {
    throw new Error("Error de sintaxis no se aceptan esos tipos de simbolos");
  }
}

module.exports = {
  validate,
  arr,
  strings,
  lengths,
  validationLike,
};
