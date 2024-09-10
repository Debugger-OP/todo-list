// console.log("Hello world!")

// var state = {
//     taskList: [
//         {
//             imageUrl: "",
//             taskTitle: "",
//             tags: "",
//             taskDescription: ""
//         },
//         {
//             imageUrl: "",
//             taskTitle: "",
//             tags: "",
//             taskDescription: ""
//         },
//         {
//             imageUrl: "",
//             taskTitle: "",
//             tags: "",
//             taskDescription: ""
//         },
//         {
//             imageUrl: "",
//             taskTitle: "",
//             tags: "",
//             taskDescription: ""
//         }
//     ]
// }

var state = {
  taskList: [],
}; // creates an object state which have tasklist empty array which should be filled later.

/*DOM OPERATIONS*/

//this is DOM operation which link and copy all the values of "task__contents" and "task__modal__body"
// in the container taskContents and taskModal respectively.so that we can store retrieved data into tasklist array of state obj.
var taskContents = document.querySelector(".task__contents");
var taskModal = document.querySelector(".task__modal__body");

//This function takes an object containing task data (like id, title, description, type, and url)
// and returns a string of HTML representing a task card(inshort this is the template which is to be dynamically).
const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>            <!-- this will create a main div which have id assigned in handleSubmit-->
        <div class="card shadow-sm task__card">                        <!-- this will create a sub main div -->
            <div class="card-header d-flex justify-content-end task__card__header gap-2">
                <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick="editTask.apply(this, arguments)"> 
                    <i class="fas fa-pencil-alt" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2 name=${id}" onclick="deleteTask.apply(this, arguments)">
                    <i class="fas fa-trash-alt" name=${id}></i>
                </button>
            </div>
            <div class="card-body">             <!-- this is the body of the template card-->

            <!-- this will take url to create an image on the card as the user passed the image url by ternary operator, "url" if its true (url is present) then 1st condtion otheriwse 2nd which have default image url -->

                ${
                  url
                    ? `<img width="100%" src=${url} alt="card image top" class="card-image-top md-3 rounded-lg" />`
                    : `<img width="100%" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScujirQqIFjN5GuM1565_-DIX6OyU_96HzNBl_BAX8GL0JzMs8&s" alt="card image top" class="card-image-top md-3 rounded-lg" />`
                } 

                
                <h4 class="card-title">${title}</h4>        <!-- this is card title heading of 4size-->
                <p class="description trim-3-lines text-muted card-text">${description}</p>
                <div class="tags text-white d-flex flex-wrap">
                    <span class="badge bg-primary m-1">${type}</span>
                </div>
            </div>
            <div class="card-footer"> 

            <!-- in this button we have data-bs-toggle="modal" which tells when this button is clicked open the modal 
                 and  data-bs-target="#showTask" tells open the modal which have id = #showTask(same as css id selector)
                 and these are bootstrap elements-->

                <button type="button" class="btn btn-outline-primary float-right"  data-bs-toggle="modal" 
                data-bs-target="#showTask" id=${id} onclick='openTask.apply(this, arguments)'>
                Open Task</button>
            </div>
        </div>
    </div>
`;

const htmlModalContent = ({ id, title, description, url }) => {
  //this add the id data to container date as an obj,which is retrieved from the handleSubmit in the from of milliseconds and
  //firstly converted to int for type safety using parse.int() function.
  // and Using new Date(parseInt(id)) is essential because it converts a timestamp (milliseconds since epoch) into a Date object for easy date formatting and manipulation. Without this conversion, you only have a raw integer, not a human-readable date.
  const date = new Date(parseInt(id));

  return `
    <div id=${id}>
        ${
          url
            ? `<img width="100%" src=${url} alt="card image cap" class="image-fluid mb-3" />`
            : `<img width="100%" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScujirQqIFjN5GuM1565_-DIX6OyU_96HzNBl_BAX8GL0JzMs8&s" alt="card image cap" class="image-fluid mb-3" />`
        }

        <!-- This converts the Date object to a string in a readable format, like "Wed Jul 24 2024" -->
        <strong class="text-sm text-muted">Created On ${date.toDateString()}</strong>

        <h2 class="my-3">${title}</h2>
        <p class="lead">${description}</p>
    </div>
    `;
};

//this function will update the local storage of web browser after converting tasklist array or state object(key:"values") into string coz web storage can only store data in the from of strings ("key":"values")
const updateLocalStorage = () => {
  localStorage.setItem(
    "task", //key of local storage
    JSON.stringify({ tasks: state.taskList }) // here "tasks" is key of object which are converted into string and counted as
    //values of key "task".
  );
};

//this code will load and display the data on webpage when refreshed or opened
const loadInitialData = () => {
  //localStorage.task will be stored in localStorageCopy after parsing in js object  from string.
  const localStorageCopy = JSON.parse(localStorage.task);

  //it will check localStorageCopy is not null,undef if its true then this will copy the lclstoragecopy data to state.tasklist
  //coz when user make a change in a webapge then on reload or refresh state will get updated and will display updated data.
  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  /*This code snippet will iterate over state.tasklist array elements using map function and for each element it inside fucntion and convert its data into html strings and insert converted string to taskContent DOM reference.*/

  //here map() will iterate over state.takslist and assign iterated data to cardDate parameter. like { id: '1', title: 'Task 1', description: 'Description 1' }
  state.taskList.map((cardDate) => {
    //here htmltaskcontent(cardDate) will create a html struct on cardDate data and then passed the generated html struct to taskContents html reference and generate new html struct on beforeend position.
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
};

//this function will act as a trigger as soon as save changes button of modal is clicked.
const handleSubmit = (event) => {
  const id = `${Date.now()}`; //this will fetch the current date and time in milliseconds as epoch standard and store it in id.
  const input = {
    //this will pass the data which user entered in modal to paramteres url,title,desc,type and store in input obj.
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    type: document.getElementById("tags").value,
  };

  //this will confirm that all the mandatory options are filled by the user, otherwise it will show the alert msg.
  if (input.title === "" || input.description === "" || input.type === "") {
    return alert("Please fill all the mandatory fields!");
  }

  //to load the user entered data in the modal, immidiatly on the display
  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({ ...input, id })
  );

  //this will update or push the user entered data to state.tasklist by using the push() function
  state.taskList.push({ ...input, id });
  updateLocalStorage(); //this will update the local storage by calling the previous made update local storage function.
};

//this will enable the functionality to open the added card details by button "open task"
const openTask = (e) => {
  if (!e) e = window.event; //here e is event object, this will if e has no event assigned then it will assign window.event to it.

  //this will find the triggered id when button is clicked using find function, find() will iterate each element of state.tasklist and compare each element id with clicked button id, which is accessed by e.target.id, if its strictly true then it will destructured to extract its id property ({id}) and store the same id card data to getTask.
  const getTask = state.taskList.find(({ id }) => id === e.target.id);

  // this will replace the entire html code of taskModal with the new one using innerHTML method with the data of htmlModalContent(getTask)
  taskModal.innerHTML = htmlModalContent(getTask);
};

// this will excecute the delete button and delete the card from the web storage,array and webpage.
const deleteTask = (e) => {
  console.log("worked");
  if (!e) e = window.event;
  const targetId = e.target.getAttribute("name"); //doubt
  const type = e.target.tagName; //it will store the type of clicked element "BUTTON"/"icon(I)"

  //this will destruct the or extract the targated data from the tasklist by comapring id with targetid, if false then extract other wise pass and store the passed data in the remove task.
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);
  //this will update the the tasklist(without the extracted one)
  state.taskList = removeTask;
  updateLocalStorage(); //update the local Storage

  //this will compare the type with "BUTTON", if true then it will return the fuction
  if (type === "BUTTON") {
    //this will navigate to the 4th parentnode of e.targetId (BUTTON) and remove the all the parentNodes till 3rd parentNode of e.targetId with itself obv.
    return e.targetId.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.targetId.parentNode.parentNode.parentNode
    );
  }
  //this is else statemnt, in case user click on icon and will behave like if statement, it will navigate to 5th parentNode of icon and remove itself with all the parentNOdes till 4th parentNode.
  return e.targetId.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.targetId.parentNode.parentNode.parentNode.parentNode
  );
};
