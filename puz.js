const dragstartHandler = event => {
    console.log("dragstart")
    event.dataTransfer.setData("text/plain", event.target.id)
    event.dataTransfer.dropEffect = "move";
}

const dragoverHandler = event => {
    console.log("dragOver");
    event.preventDefault();
}

const dropHandler = event => {
    console.log("drag")
    event.preventDefault();

    const data = event.dataTransfer.getData("text/plain");
    event.target.innerText = document.getElementById(data).innerText;


    event.target.classList.remove("blank")
    event.target.setAttribute("ondrop", "");
    event.target.setAttribute("ondragover","");

    document.getElementById(data).innerText = "";

    current.content = getCurrent(ul);
    current.dimension = getDimension(current);

}




const removeDroppable = (items) => {
    items.forEach((item) => {
        item.setAttribute("ondrop", "");
        item.setAttribute("ondragover", "");
        item.setAttribute("draggable", "false");
        item.setAttribute("ondragstart", "");
        item.setAttribute("ondragend", "");
    })
}


const dragendHandler = event => {
  console.log("dragEnd");

  event.dataTransfer.clearData();

  removeDroppable(document.querySelectorAll('li'));

  setDroppable(document.querySelectorAll('li'));
  setDraggable(document.querySelectorAll('li'))


    if(correct(numbers, current.content)) {
        showPopUp();
    }
}

const showPopUp = () => {
    document.getElementById('message').innerText = "Winner Winner Chicken Dinner!";
    document.getElementById('popup').classList.remove("hide");

}

const closePopUp = () => {
    document.getElementById('popup').classList.add("hide");
}



let ul = document.querySelectorAll('li');
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", ""];

const current = {}
current.content = numbers;


function setUp () {
    fillGrid(ul, numbers);
    setID(ul)

    current.content = getCurrent(ul); // store tiles in 1D array
    current.dimension = getDimension(current); //store tiles in a 2D array


    setDroppable(ul);
    setDraggable(ul);
}






const getCurrent = (items) => {

    const content = [];
    items.forEach((item, i) => {
        content.push(item.innerText)
    });
    return content;
}


const getDimension = (current) => {
    let y = 0;
    let arr = [];
    const {content} = current;
    for(let x = 0; x < 3; x++) {
        arr.push(content.slice(y, y+3));
        y+=3;
    }

    return arr;
}






const setDroppable = (items) => {
    items.forEach((item, x) => {
        if(!item.innerText) {
            current.emptyCellIndex = x; //index from the 1D
            item.setAttribute("ondrop", "dropHandler(event);");
            item.setAttribute("ondragover", "dragoverHandler(event);");
            item.setAttribute("class", "blank");
        }
        return;
    })
}

const setDraggable = (items) => {
    const [row, col] = getEmptyCell();

    let left, right, top, bottom = null;

    if(current.dimension[row][col-1]) left = current.dimension[row][col-1];
    if(current.dimension[row][col+1]) right = current.dimension[row][col+1];

    if(current.dimension[row-1] != undefined) top = current.dimension[row-1][col];
    if(current.dimension[row+1] != undefined) bottom = current.dimension[row+1][col];



    items.forEach(item => {
        if(item.innerText == top || item.innerText == bottom || item.innerText == right || item.innerText == left) {
            item.setAttribute("draggable", "true");
            item.setAttribute("ondragstart", "dragstartHandler(event)");
            item.setAttribute("ondragend", "dragendHandler(event)");
            }
    })
}







const setID = (items) => {
    for (let x = 0; x < items.length; x++) {
        items[x].setAttribute("id", `li${x}`);
    }
}


const shuffle = (arr) => {
    const dupe = [...arr];

    for(let x = 0; x < dupe.length; x++) {

        let y = parseInt(Math.random()*dupe.length);

        let temp = dupe[x];
        dupe[x] = dupe[y];
        dupe[y] = temp;
    }   
    return dupe;
 }



const solvable = (arr) => {
    let inversions = 0;

    for (let x = 0; x<arr.length; x++) {

        for (let y = x+1; y<arr.length; y++) {
            if((arr[x] && arr[y]) && [x] > arr[y]) inversions++;
        }
    }

    return (inversions % 2==0);
}


const correct = (result, content) => {
    if(JSON.stringify(result) == JSON.stringify(content)) return true;
    return false;
}




const fillGrid = (items, numbers) => {

    let shuffled = shuffle(numbers);


    while(!solvable(shuffled)) {
        shuffled = shuffle(numbers);
    }

    items.forEach((item, x) => {

        item.innerText = shuffled[x];
    })
}


fillGrid(ul, numbers);
setID(ul);  

const getEmptyCell = () => {
    const emptyCellNumber = current.emptyCellIndex+1;
    const emptyCellRow = Math.ceil(emptyCellNumber/3);
    const emptyCellCol = 3 - (3 * emptyCellRow - emptyCellNumber);
    return [emptyCellRow-1, emptyCellCol-1]
}







