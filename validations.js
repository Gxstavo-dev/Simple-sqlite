// validacion de nombres para el nombre de las tablas para evitar inyecciones sql
function validate(name) {
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error("It does not meet the requirements for the table name.");
  }
}
// validacion para checar si son tipo string lo ingresado por el usuario
function strings(text) {
  if (!text || typeof text !== "string") {
    throw new Error("It is not a string");
  }
}
// validacion para checar si son tipo array lo ingresado por el usuario

function arr(arrays) {
  if (!arrays || !Array.isArray(arrays)) {
    throw new Error("It is not an array");
  }
}
// validacion para checar si dos arrays tienen la misma longitud

function lengths(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error("They are not the same size");
  }
}

function validationLike(text) {
  const valor = String(text);

  if (!/^[a-zA-Z0-9 ]*$/.test(valor)) {
    throw new Error("Syntax error: those types of symbols are not allowed");
  }
}

module.exports = {
  validate,
  arr,
  strings,
  lengths,
  validationLike,
};
