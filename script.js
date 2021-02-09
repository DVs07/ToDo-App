todoMain();

function todoMain(){
    const DEFAULT_OPTION = "Categoria";

    
    let inputElement,
        secInputEle,
        addButton,
        sortButton,
        dateInput,
        timeInput,
        selectCategory,
        todoList = [],//Se crea un array, este solo puede contener string, se guardan en el local storage.
        calendar, 
        incompleteSortBtn;

        getElements();
        addListeners();
        initCalendar();
        loadLocalStorage()//Cargo las tareas desde el local storage
        renderRows(todoList);
        
        updateOptionsCategory();//Agrega nuevas categorias

    function getElements(){
        //First input agrega elementos a la lista
        inputElement = document.getElementsByTagName("input")[0];
        //Second input agrega la cateoria del elemento
        secInputEle = document.getElementsByTagName("input")[1];
        dateInput = document.getElementById("dateInput");
        timeInput = document.getElementById("timeInput");
        addButton = document.getElementById("addBtn");
        sortButton = document.getElementById("sortBtn");
        selectCategory = document.getElementById("categoryFilter");
        incompleteSortBtn = document.getElementById('customCheckbox');
    };
    
    function addListeners(){
        addButton.addEventListener("click", addEntry, false);
        sortButton.addEventListener("click", sortEntry,false);
        selectCategory.addEventListener("change", multipleFilter, false);
        incompleteSortBtn.addEventListener("change", multipleFilter, false);
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
    //Actualiza y agrega opciones de categorias 
    function updateOptionsCategory(){
        //Creo un array para esas nuevas categorias
        let newOptionsCategories = []
        todoList.forEach((obj) => {
            newOptionsCategories.push(obj.category);
        });

        let optionsSet = new Set(newOptionsCategories)

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
                newCategory.value = option;
                newCategory.innerText = option;
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
    function renderRows(arr){
        arr.forEach((todoObject) => {
        
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
        
        //Celda Hora
        let tdTime = document.createElement("td");
        tdTime.innerText = time;
        trElement.appendChild(tdTime);
        
        //Celda To-Do
        let tdSecond = document.createElement("td");
        tdSecond.innerText = inputValue;
        trElement.appendChild(tdSecond);
        
        //Celda Categoria
        let tdThird = document.createElement("td");
        tdThird.innerText = secInputValue;
        tdThird.className = "categoryCell";
        trElement.appendChild(tdThird);

        //Celda Borrar
        let deleteIcon = document.createElement("i");
        deleteIcon.style.fontSize = "1.5em";
        deleteIcon.className= "las la-trash-alt";
        deleteIcon.addEventListener("click", deleteItem, false );
        deleteIcon.dataset.id = id;
        let tdFourth = document.createElement("td");
        tdFourth.appendChild(deleteIcon);
        trElement.appendChild(tdFourth);
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

        addEventCalendar({
            id: id,
            title: inputValue,
            start: date,
        });
        // Eliminar una tarea -  Alternativa
        function deleteItem(){
            trElement.remove();
            updateOptionsCategory();
            for( let i = 0; i<todoList.length; i++){
                if(todoList[i].id == this.dataset.id){
                    todoList.splice(i,1);//Borro  la tarea del LS
                }
                saveLocalStorage();
                //Se borra la tarea también en el calendario
                calendar.getEventById(this.dataset.id).remove();
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
    //Crea un ID unico para cada tarea
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
    function sortEntry(){
        todoList.sort((b,a)=> {//(a,b) de menor a mayor y (b,a) de mayor a menor
            let aDate = Date.parse(a.date);//Lo parse a milisegundos
            let bDate = Date.parse(b.date);
            return aDate - bDate;
        });
        saveLocalStorage();//Guarda automaticamente ordenada las tareas por fecha
        clearTable();
        renderRows(todoList);
    }
    function initCalendar(){
        var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar:{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
                
            },
            events: [],
        });
        calendarEl.style.color = "white";
        calendar.setOption("locale","Es");
    calendar.render();
    }
    function addEventCalendar(event){
        calendar.addEvent(event);//Agrego las tareas al calendario
    }
    function clearTable(){
        //Vacio mi tabla pero mantengo mi 1er fila
        let trElements = document.getElementsByTagName("tr");//
        for(let i = trElements.length - 1; i > 0 ;i--){
            trElements[i].remove();
        }
        calendar.getEvents().forEach(event => event.remove());//Al filtrar por categoria, las muestro en el calendario.
    }
    function incompletList(){
        clearTable();
        if(incompleteSortBtn.checked){
            let filterIncompleteArray = todoList.filter(obj => obj.done == false);
            renderRows(filterIncompleteArray);
            filterDoneArray = todoList.filter(obj => obj.done == true);
            renderRows(filterDoneArray);
        }
        else{
            renderRows(todoList);
        }
    }
    function multipleFilter(){
        clearTable();
        let selection = selectCategory. value;

        if(selection == DEFAULT_OPTION){
            if(incompleteSortBtn.checked){
                let filterIncompleteArray = todoList.filter(obj => obj.done == false);
                renderRows(filterIncompleteArray);
                filterDoneArray = todoList.filter(obj => obj.done == true);
                renderRows(filterDoneArray);
            }
            else{
                renderRows(todoList);
            }
        }
        else{
            let filteredCategoryArray = todoList.filter(obj => obj.category == selection)
            if(incompleteSortBtn.checked){
                let filterIncompleteArray = filteredCategoryArray.filter(obj => obj.done == false);
                renderRows(filterIncompleteArray);
                filterDoneArray = filteredCategoryArray.filter(obj => obj.done == true);
                renderRows(filterDoneArray);
            }
            else{
                renderRows(filteredCategoryArray);
            }
        }
    }
};