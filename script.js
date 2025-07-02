const form =
  document.getElementById(
    "transactionForm"
  ); /* constante de tipo formulario (objeto) */
// Agrega un evento al formulario para manejar el envío
form.addEventListener("submit", function (event) {
  event.preventDefault(); /* previene recarga página */
  let transactionFormData = new FormData(
    form
  ); /* creo objeto que contiene formulario */
  let transactionObjet = convertFormDataToTransactionObj(transactionFormData);
  saveTransactionObjet(
    transactionObjet
  ); /* envió el obj a la funcion que lo guarda en LS */
  insertRowIntoTransaction(transactionObjet); /* Inserta objeto en fila */
});
// Carga el contenido del DOM y las transacciones guardadas
document.addEventListener(
  "DOMContentLoaded",
  function (event) /* cargo el contenido del dom */ {
    let transactionObjetArr =
      JSON.parse(localStorage.getItem("transactionData")) || [];
    transactionObjetArr.forEach(
      /* recorre el vector objetos transacciones*/
      function (arrayElement) {
        insertRowIntoTransaction(
          arrayElement
        ); /* agrega transacciones a las filas de la tabla */
        console.log("Inserte elemento");
      }
    );
  }
);
// retorna id para cada fila
function getNewTransactionId() {
  let lastTransactionId =
    localStorage.getItem("lastTransactionId") ||
    "-1"; /* obtiene el último id */
  let newTransactionId =
    JSON.parse(lastTransactionId) + 1; /* asigna nuevo id */
  localStorage.setItem(
    "lastTransactionId",
    JSON.stringify(newTransactionId)
  ); /* guarda el nuevo id */
  return newTransactionId;
}
// convierte FormData a objeto de transacción
function convertFormDataToTransactionObj(transactionFormData) {
  /* toma lo campos de formData y transforma a variables */
  let typeSelector = transactionFormData.get("typeSelector");
  let transactionDescription = transactionFormData.get(
    "transactionDescription"
  );
  let transactionCategory = transactionFormData.get("transactionCategory");
  let transactionAmount = transactionFormData.get("transactionAmount");
  let transactionId = getNewTransactionId(); /* asigna id a la transacción */
  return {
    /* retorna objeto con cada campo */
    typeSelector: typeSelector,
    transactionDescription: transactionDescription,
    transactionCategory: transactionCategory,
    transactionAmount: transactionAmount,
    transactionId: transactionId,
  };
}
// Agrega una fila a la tabla de transacciones
function insertRowIntoTransaction(transactionObjet) {
  /* selecciona tabla y le inserta fila */
  let transactionTableRef = document.getElementById("transactionTable");

  let newTransactionRowRef = transactionTableRef.insertRow(-1); //se inserta al final
  newTransactionRowRef.setAttribute(
    "transactionId",
    transactionObjet["transactionId"]
  ); // asigna el id de la transacción a la fila
  let newTypeCellRef = newTransactionRowRef.insertCell(0);
  newTypeCellRef.textContent = transactionObjet["typeSelector"];
  /* inserta objeto en celda */
  let newDescCellRef = newTransactionRowRef.insertCell(1);
  newDescCellRef.textContent = transactionObjet["transactionDescription"];

  let newAmountCellRef = newTransactionRowRef.insertCell(2);
  newAmountCellRef.textContent = transactionObjet["transactionAmount"];

  let newCategoryCellRef = newTransactionRowRef.insertCell(3);
  newCategoryCellRef.textContent = transactionObjet["transactionCategory"];

  let newDeleteCell = newTransactionRowRef.insertCell(4);
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.classList.add("boton-eliminar"); // clase para aplicar estilos
  newDeleteCell.appendChild(deleteButton);

  // Agregar evento al botón de eliminar
  deleteButton.addEventListener("click", function (event) {
    let transactionRow = event.target.parentNode.parentNode; // Obtiene la fila de la transacción
    let transactionId = transactionRow.getAttribute("data-transaction-id"); // Obtiene el ID de la transacción
    event.target.parentNode.parentNode.remove(); // Elimina la fila de la tabla
    deleteTransaction({ transactionId }); // Llama a la función para eliminar la transacción del localStorage
    console.log("Transacción eliminada:", transactionId);
  });

  // Limpiar el formulario después de agregar
  form.reset();
}
// Guarda el objeto de transacción en localStorage
function saveTransactionObjet(transactionObjet) {
  /* al array existente agrego nuevos obj */
  /* obtengo del localStorage el string array y lo transformo en array con parse */
  let myTransactionArray =
    JSON.parse(localStorage.getItem("transactionData")) ||
    []; /* si no hay nada cargado, devuelve array vacio(|| []) y no null que genera error  */
  myTransactionArray.push(
    transactionObjet
  ); /* al array le agrego el objeto con Push */
  /* guarda el objeto en localStorage */
  let transactionArrayJSON =
    JSON.stringify(
      myTransactionArray
    ); /* transformo obj array en string con JSON */
  localStorage.setItem(
    "transactionData",
    transactionArrayJSON
  ); /* setea el obj con su nombre en el LS */
}
// Elimina una transacción y actualiza la tabla
function deleteTransaction(transactionId) {
  let transactionObjetArr = JSON.parse(localStorage.getItem("transactionData")); // iMPORTANTE: PRIMERO PASO DE JSON A OBJETO
  let transactionIndexInArray = transactionObjetArr.findIndex(
    (element) => element.transactionId === transactionId.transactionId
  );
  transactionObjetArr.splice(transactionIndexInArray, 1); // Elimina el elemento del array
  let transactionArrayJSON = JSON.stringify(transactionObjetArr); // Convierte el array actualizado a JSON (SEGUNDO PASO DE OBJETO A JSON)
  localStorage.setItem("transactionData", transactionArrayJSON); // Guarda el array actualizado en localStorage
  // Actualiza la tabla eliminando la fila correspondiente
}
