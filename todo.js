todoMain();

function todoMain(){
    const DEFAULT_OPTION = "Categoria";

    let inputElement,
        secInputEle,
        button,
        ulElement,
        selectCategory;
    
        getElements();
    addListeners();

    function getElements(){
        //First input agrega elementos a la lista
        inputElement = document.getElementsByTagName("input")[0];
        //Second input agrega la cateoria del elemento
        secInputEle = document.getElementsByTagName("input")[1];
        button = document.getElementById("addBtn");
        
        selectCategory = document.getElementById("categoryFilter");
    };
    
    function addListeners(){
        button.addEventListener("click", addEntry, false);
        selectCategory.addEventListener("change", filterEntries, false);

    }
    function addEntry(event){

        let flag = true;
        //1st
        let inputValue = inputElement.value;
        
        inputElement.value = ""; //Resetea el input(vacio)
        
        //2nd
        let secInputValue = secInputEle.value;
        secInputEle.value = "";

        //Tabla
        let todoTable = document.getElementById("todoTable");

        let trElement = document.createElement("tr");

        todoTable.appendChild(trElement);

        //Celda Checkbox
        let checkboxELement = document.createElement("input");
        checkboxELement.type = "checkbox";
        let tdFirst = document.createElement("td");
        tdFirst.appendChild(checkboxELement);
        trElement.appendChild(tdFirst);
        tdFirst.classList.add("colorTd");
        tdFirst.classList.add("center");
        checkboxELement.addEventListener("click", done, false);
        //Celda To-Do
        let tdSecond = document.createElement("td");
        tdSecond.innerText = inputValue;
        trElement.appendChild(tdSecond);
        tdSecond.classList.add("colorTd");
        //Celda Categoria
        let tdThird = document.createElement("td");
        tdThird.innerText = secInputValue;
        trElement.appendChild(tdThird);
        tdThird.classList.add("colorTd");
        //Celda Borrar
        let deleteIcon = document.createElement("i");
        deleteIcon.style.fontSize = "1.5em";
        deleteIcon.className= "las la-trash-alt";
        deleteIcon.addEventListener("click", deleteItem, false );
        let tdFourth = document.createElement("td");
        tdFourth.appendChild(deleteIcon);
        trElement.appendChild(tdFourth);
        tdFourth.classList.add("colorTd");
        tdFourth.classList.add("center");

        //Agrega nuevas categorias
        updateOptionsCategory();


        //Alternativa
    function deleteItem(){
        trElement.remove();
        updateOptionsCategory();

    }

    function done(){
        trElement.classList.toggle("strike");
    }
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
                let category = row.getElementsByTagName("td")[2].innerText;
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
        //Creo un array para esas nuevsa categorias
        let newOptionsCategories = []
        let rows = document.getElementsByTagName("tr");
        Array.from(rows).forEach( (row, index) => {
            //Devuelve la 1er fila de la tabla
            if(index == 0){
                return;
            }
            let category = row.getElementsByTagName("td")[2].innerText;
            
                //Agrego al final del array la nueva categoria
                newOptionsCategories.push(category);
            
        });
        console.log(newOptionsCategories);

        let optionsSet = new Set(newOptionsCategories)
        console.log(optionsSet);

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

};
