const form = document.getElementById("transactionForm");  /* constante de tipo formulario (objeto) */
        
        form.addEventListener("submit", function(event) {
            event.preventDefault();       /* previene recarga página */
            let transactionFormData = new FormData(form);  /* creo objeto que contiene formulario */
            let transactionObjet = convertFormDataToTransactionObj(transactionFormData)
            saveTransactionObjet(transactionObjet)  /* envió el obj a la funcion que lo guarda en LS */
            insertRowIntoTransaction(transactionObjet);  /* Inserta objeto en fila */
        });

        document.addEventListener("DOMContentLoaded", function(event) /* cargo el contenido del dom */{
            let transactionObjetArr = JSON.parse (localStorage.getItem("transactionData")) || [];
            transactionObjetArr.forEach(  /* recorre el vector objetos transacciones*/
                function(arrayElement) {
                    insertRowIntoTransaction(arrayElement)  /* agrega transacciones a las filas de la tabla */
                    console.log("Inserte elemento")
                })

    }) 

        function convertFormDataToTransactionObj(transactionFormData){
            /* toma lo campos de formData y transforma a variables */
            let typeSelector = transactionFormData.get("typeSelector");
            let transactionDescription= transactionFormData.get("transactionDescription");
            let transactionCategory = transactionFormData.get("transactionCategory");
            let transactionAmount = transactionFormData.get("transactionAmount");
            return { /* retorna objeto con cada campo */
                "typeSelector": typeSelector,
                "transactionDescription" : transactionDescription ,
                "transactionCategory" : transactionCategory ,
                "transactionAmount" : transactionAmount 
            }

        }

        function insertRowIntoTransaction(transactionObjet){
            /* selecciona tabla y le inserta fila */
            let transactionTableRef = document.getElementById("transactionTable");

            let newTransactionRowRef = transactionTableRef.insertRow(-1);
            
            /* crea celda y la inserta en pos (i) */
            let newTypeCellRef = newTransactionRowRef.insertCell(0);
            newTypeCellRef.textContent = transactionObjet["typeSelector"];
            /* inserta objeto en celda */
            let newDescCellRef = newTransactionRowRef.insertCell(1);
            newDescCellRef.textContent = transactionObjet["transactionDescription"];
            
            let newAmountCellRef = newTransactionRowRef.insertCell(2);
            newAmountCellRef.textContent = transactionObjet["transactionAmount"];
            
            let newCategoryCellRef = newTransactionRowRef.insertCell(3);
            newCategoryCellRef.textContent = transactionObjet["transactionCategory"];

            // Limpiar el formulario después de agregar
            form.reset();
        }

        function saveTransactionObjet(transactionObjet){ /* al array existente agrego nuevos obj */
            /* obtengo del localStorage el string array y lo transformo en array con parse */
            let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];   /* si no hay nada cargado, devuelve array vacio(|| []) y no null que genera error  */
            myTransactionArray.push(transactionObjet) /* al array le agrego el objeto con Push */
            /* guarda el objeto en localStorage */
            let transactionArrayJSON = JSON.stringify(myTransactionArray); /* transformo obj array en string con JSON */
            localStorage.setItem("transactionData", transactionArrayJSON);/* setea el obj con su nombre en el LS */
        }