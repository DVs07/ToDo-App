todoMain();

function todoMain(){
    const DEFAULT_OPTION = "Categoria";

    let inputElement,
        secInputEle,
        button,
        //ulElement,
        dateInput,
        timeInput,
        selectCategory,
        todoList = [];//Se crea un array, este solo puede contener string, se guardan en el local storage.
    

        /*LOCAL STORAGE */
        //localStorage.setItem("Prueba", todoList);
        /*todoList = localStorage.getItem("Prueba");
        console.log(todoList);*/

        getElements();
        addListeners();
        //Cargo las tareas desde el local storage
        loadLocalStorage()
        renderRows();
        //Agrega nuevas categorias
        updateOptionsCategory();

    function getElements(){
        //First input agrega elementos a la lista
        inputElement = document.getElementsByTagName("input")[0];
        //Second input agrega la cateoria del elemento
        secInputEle = document.getElementsByTagName("input")[1];
        dateInput = document.getElementById("dateInput");
        timeInput = document.getElementById("timeInput");
        button = document.getElementById("addBtn");
        
        selectCategory = document.getElementById("categoryFilter");
    };
    
    function addListeners(){
        button.addEventListener("click", addEntry, false);
        selectCategory.addEventListener("change", filterEntries, false);

    }
    function addEntry(event){

        let flag = true;
        //Todo input
        let inputValue = inputElement.value;
        inputElement.value = ""; //Resetea el input(vacio)
        
        //Category input
        let secInputValue = secInputEle.value;
        secInputEle.value = "";
        
        //Date input
        let dateValue = dateInput.value;
        dateInput.value = "";
        
        //Time input
        let timeValue = timeInput.value;
        timeInput = "";
        
        let object = {
            id: _uuid(),//Indica la posición que tiene en el array
            todo: inputValue, 
            category: secInputValue,
            date: dateValue,
            time: timeValue,
            done: false//Nos va a servir para eliminarlo del LS
        };

        displayRow(object);

        /* PUSH ITEMS */
        todoList.push(object);//Se crea un objeto para almacenar en LS también la categoria 
        

        saveLocalStorage();

    }
    

    function filterEntries(event){

        let selection = selectCategory. value;
        
        //Alternativa
        //Categoria muestra todas las tareas
        if(selection == DEFAULT_OPTION){
            let rows = document.getElementsByTagName("tr");
            Array.from(rows) .forEach( (row, index) => {
                row.style.display = "";
            });
        }
        else{
            //Solo se muestra lo filtrado segun categoria
            let rows = document.getElementsByTagName("tr");
            Array.from(rows).forEach( (row, index) => {
                //Devuelve la 1er fila de la tabla
                if(index == 0){
                    return;
                }
                let category = row.getElementsByTagName("td")[4].innerText;
                if(category == selectCategory.value){
                    row.style.display = "";
                }
                else{
                    row.style.display = "none";
                }
            });
        }
        
    }

    //Actualiza y agrega opciones de categorias 
    function updateOptionsCategory(){
        //Creo un array para esas nuevas categorias
        let newOptionsCategories = []
        let rows = document.getElementsByTagName("tr");
        Array.from(rows).forEach( (row, index) => {
            //Devuelve la 1er fila de la tabla
            if(index == 0){
                return;
            }
            let category = row.getElementsByTagName("td")[4].innerText;
            
                //Agrego al final del array la nueva categoria
                newOptionsCategories.push(category);
            
        });
        //console.log(newOptionsCategories);

        let optionsSet = new Set(newOptionsCategories)
        //console.log(optionsSet);

        //Vacia las categorias
        selectCategory.innerHTML = "";

        //Se muestran todas las categorias
        let newCategory = document.createElement("option");
        //El problema es que si borro mi tarea, la categoria sigue dentro de las opciones de categoria
        newCategory.innerText = DEFAULT_OPTION;
        newCategory.value = DEFAULT_OPTION;
        selectCategory.appendChild(newCategory);

            for(let option of optionsSet){
                //Agregar nuevas categorias desde del input
                let newCategory = document.createElement("option");
                //El problema es que si borro mi tarea, la categoria sigue dentro de las opciones de categoria
                newCategory.innerText = option;
                newCategory.value = option;
                selectCategory.appendChild(newCategory);
            }
            
        
    }
    /* LOCAL STORAGE */
    function saveLocalStorage(){
        let stringified = JSON.stringify(todoList);
        localStorage.setItem("todoList", stringified);
    }
    function loadLocalStorage(){
        let retrieved = localStorage.getItem("todoList");
        todoList = JSON.parse(retrieved);
        
        if(todoList == null){
            todoList = [];
        }
    }
    /* ROWS */ 
    function renderRows(){
        todoList.forEach((todoObject) => {
        
            displayRow(todoObject);
        });

    }
    //Muestro las tareas guardadas en local storage
    function displayRow({todo: inputValue, category: secInputValue, id, date, time, done}){

        //Tabla
        let todoTable = document.getElementById("todoTable");

        let trElement = document.createElement("tr");

        todoTable.appendChild(trElement);

        trElement.classList.add("colorTd");
        //Celda Checkbox
        let checkboxELement = document.createElement("input");
        checkboxELement.type = "checkbox";
        let tdFirst = document.createElement("td");
        tdFirst.appendChild(checkboxELement);
        trElement.appendChild(tdFirst);
        //tdFirst.classList.add("colorTd");
        tdFirst.classList.add("center");
        checkboxELement.addEventListener("click", checkboxClickCallback, false);
        checkboxELement.dataset.id = id;//Lo uso como indice para saber su posición
        //Celda  Fecha
        let tdDate = document.createElement("td");
        tdDate.innerText = date;
        let dateObject = new Date(date);
        let formattedDate = dateObject.toLocaleString("es-AR", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        console.log(formattedDate);
        tdDate.innerText = formattedDate;
        trElement.appendChild(tdDate);
        //tdDate.classList.add("colorTd");
        //Celda Hora
        let tdTime = document.createElement("td");
        tdTime.innerText = time;
        trElement.appendChild(tdTime);
        //tdTime.classList.add("colorTd");
        //Celda To-Do
        let tdSecond = document.createElement("td");
        tdSecond.innerText = inputValue;
        trElement.appendChild(tdSecond);
        //tdSecond.classList.add("colorTd");
        //Celda Categoria
        let tdThird = document.createElement("td");
        tdThird.innerText = secInputValue;
        trElement.appendChild(tdThird);
        //tdThird.classList.add("colorTd");
        //Celda Borrar
        let deleteIcon = document.createElement("i");
        deleteIcon.style.fontSize = "1.5em";
        deleteIcon.className= "las la-trash-alt";
        deleteIcon.addEventListener("click", deleteItem, false );
        deleteIcon.dataset.id = id;
        let tdFourth = document.createElement("td");
        tdFourth.appendChild(deleteIcon);
        trElement.appendChild(tdFourth);
        //tdFourth.classList.add("colorTd");
        tdFourth.classList.add("center");
        //tdFourth.classList.add("eliminar");
        
        console.log(done);
        checkboxELement.type = "checkbox";
        checkboxELement.checked = done;//Chequeo el valor del checkbox(V o F) y según su valor lo muestro al recargar la página.
        if(done){
            trElement.classList.add("strike");
        }else{
            trElement.classList.remove("strike");
        }

        // Eliminar una tarea -  Alternativa
        function deleteItem(){
            trElement.remove();
            updateOptionsCategory();
            for( let i = 0; i<todoList.length; i++){
                if(todoList[i].id == this.dataset.id){
                    todoList.splice(i,1);//Borro  la tarea del LS
                }
                saveLocalStorage();
            }
        }
        //Funcion hecha, se la tacha
        function checkboxClickCallback(){
            trElement.classList.toggle("strike");
            for( let i = 0; i<todoList.length; i++){
                if(todoList[i].id == this.dataset.id){
                    todoList[i].done = this.checked;
                }
            }
            saveLocalStorage();
        }
    }
    function _uuid() {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
          d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
};
