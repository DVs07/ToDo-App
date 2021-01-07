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
        //ulElement = document.getElementsByTagName("ul")[0];
        //console.log(inputElement);
        selectCategory = document.getElementById("categoryFilter");
    };
    
    function addListeners(){
        button.addEventListener("click", addEntry, false);
        selectCategory.addEventListener("change", filterEntries, false);
        //selectCategory.addEventListener("click",defaultCat)
    }
    function addEntry(event){
        //console.log(event.target);
        let flag = true;
        //1st
        let inputValue = inputElement.value;
        //Vulnerabilidad del input, se puede agregar tags desde este y cambiar el DOM
        //ulElement.innerHTML += `<li> ${inputValue} </li>`//Template literal
        //Concat
        //"<li>" + inputValue + "</li>"
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

        
        //Separador

        /* Ahora se muestra la lista en una tabla
        //Se corrige y todo lo igresado por el input es un elemento de la lista
        let liElement = document.createElement("li");
        
        //Creo un input de tipo checkbox
        let checkboxELement = document.createElement("input");
        checkboxELement.type = "checkbox";
        //Lo agrego a mi lista
        liElement.appendChild(checkboxELement);
        //El elemento agregado se lo pone dentro de un span, para crear un evento sobre este
        let spanElement = document.createElement("span");
        spanElement.innerText = inputValue + " - " + secInputValue;
        liElement.appendChild(spanElement);

        //Cambiamos innerText, porque al concantenar el icono de eliminar lo toma como texto y no es lo que queremos. Para eso usamos innerHTML
        //liElement.innerHTML = inputValue; 
        //Se 
        //liElement.addEventListener("click", onClick, false);
        
        //Se va a pasar por variables el icono, para hacerlo mas dinamico
        //+ "<i class='las la-trash-alt'></i> ";
        //Creo mi etiqueta contenedora del icono
        let deleteIcon = document.createElement("i");
        deleteIcon.style.fontSize = "1.5em";
        deleteIcon.style.color = "red";
        //spanElement.innerText = "delete";
        deleteIcon.className= "las la-trash-alt";
        //Se elimina un elemento de la lista
        deleteIcon.addEventListener("click", deleteItem, false );
        
        //Agrego un elemento al nodo padre
        liElement.appendChild(deleteIcon);
        ulElement.appendChild(liElement);
        */
        
        //console.log(inputValue);
         //Funcion para eliminar
        /*function deleteItem(){
            this.parentNode.remove();//Elimina el nodo padre con su hijo li>i
        }*/
        //Alternativa
    function deleteItem(){
        trElement.remove();
        updateOptionsCategory();

    }
    /* Ahora lo hacemos desde css
    //Aplico un tachado al un elemento de la lista
    function onClick(){
        if(flag)
        {
            this.classList.add("strike");
            //this.style.textDecoration = "line-through";
            flag = !flag;
        }
        else{
            //this.style.textDecoration = "none";
            this.classList.remove("strike");
            flag = !flag;
        }
        
    }*/
    function done(){
        trElement.classList.toggle("strike");
    }
    }
    

    function filterEntries(event){
        //console.log("filterEntries running");
        let selection = selectCategory. value;
        
        /*
        for(let i = 1; i < rows.length; i++){
            //console.log(rows[i]);
            let category = rows[i].getElementsByTagName("td")[2].innerText;
            if(category == selectCategory.value){
                rows[i].style.display = "";
            }
            else{
                rows[i].style.display = "none";
            }
        }*/

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

    /*function defaultCat(){
        var cat = document.getElementById("categoryFilter").options[0].disabled = true;
    }*/
    
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
            
            //No se duplican categorias nuevas
            //if(!newOptionsCategories.includes(category)){
                //Agrego al final del array la nueva categoria
                newOptionsCategories.push(category);
            //}
            
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
        //newOptionsCategories.forEach( (option) => {
            for(let option of optionsSet){
                //Agregar nuevas categorias desde del input
                let newCategory = document.createElement("option");
                //El problema es que si borro mi tarea, la categoria sigue dentro de las opciones de categoria
                newCategory.innerText = option;
                newCategory.value = option;
                selectCategory.appendChild(newCategory);
            }
            
        //});
        
    }

};
