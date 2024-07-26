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

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.task);

  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    type: document.getElementById("tags").value,
  };

  if (input.title === "" || input.description === "" || input.type === "") {
    return alert("Please fill all the mandatory fields!");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({ ...input, id })
  );

  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

// deleteTask
const deleteTask = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  // console.log(type)
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);
  // console.log(removeTask)
  state.taskList = removeTask;
  updateLocalStorage();

  if (type === "BUTTON") {
    return e.targetId.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.targetId.parentNode.parentNode.parentNode
    );
  }

  return e.targetId.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.targetId.parentNode.parentNode.parentNode.parentNode
  );
};

//editTask

const editTask = (e) => {
  console.log("loaded");
  if (!e) e = window.event;

  const targetId = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];

  taskDescription = parentNode.childNodes[3].childNodes[5];

  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

  submitButton = parentNode.childNodes[5].childNodes[1];
  console.log(submitButton);

  taskTitle.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onClick", "saveEdit.apply(this,arguments)");

  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];

  const taskDescription = parentNode.childNodes[3].childNodes[5];

  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];

  const submitButton = parentNode.childNodes[5].childNodes[1];

  const update = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.taskList;

  stateCopy = stateCopy.map((task) =>
    task.id
      ? {
          id: task.id,
          title: update.taskTitle,
          description: update.taskDescription,
          type: update.taskType,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onClick", "openTask.apply(this,arguments)");

  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.includes(e.target.value)
  );

  resultData.map((cardData) => {
    return taskContents.insertAdjacentHTML(
      "beforeend",
      htmlTaskContent(cardData)
    );
  });
};
