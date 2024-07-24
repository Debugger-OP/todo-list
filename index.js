var state = {
  taskList: [],
};

//DOM operations
var taskContents = document.querySelector(".task_contents"); //this code store the html elements who have class selector oftask_contents in taskContents using queryselector method of DOM
var taskModal = document.querySelector(".task_modal_body"); //this code store the html elements who have class selector  of task_modal_body in taskModal using queryselector method of DOM

const htmlTaskContent = ({ id, title, description, type, url }) =>
  ` <div class="col-md-6 col-lg-4 mt-3" id="${id}" key="${id}">
      <div class="card task_card shadow-sm">
        <div
          class="card-header d-flex justify-content-end task_card_header gap-2"
        >
          <button class="btn btn-outline-info mr-2 name = ${id}">
            <i class="fa-solid fa-pencil" name="${id}"></i>
          </button>

          <button class="btn btn-outline-danger mr-2 name = ${id}">
            <i class="fa-solid fa-trash" name="${id}"></i>
          </button>
        </div>

        <div class="card-body">
          ${
            url &&
            `<img
            src="${url}"
            alt="card img top"
            class=""
            card-image-top
            md-3
            rounded-lg
          />`
          }

          <h4 class="card-title">${title}</h4>

          <p class="card-text description trim-3-lines text-muted">
            ${description}
          </p>

          <div class="tags text-white d-flex flex-wrap">
            <span class="badge bg-primary m-1">${type}</span>
          </div>
        </div>

        <div class="card-footer">
          <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#showTask">
            open task
          </button>
        </div>
      </div>
    </div>
 `;

const htmlModalContent = ({ id, description, title, url }) => {
  const date = new Date(parseInt(id));

  return `
    <div id=${id}>
    ${
      url &&
      `<img
            src="${url}"
            alt="card img top"
            class=""
            image-fluid
            md-3
            rounded-lg
          />`
    }

    <strong class="text-sm text-muted">Created On ${date.toDateString()}</strong>

    <h4>${title}</h4>
    <p>${description}</p>
    </div>
  `;
};

const updateLocalStorage = () => {
  localStorage.setItem("task", JSON.stringify({ tasks: state.taskList }));
};

const loadIntialData = () => {
  const localStorageData = JSON.parse(localStorage.task);

  if (localStorageData) state.taskList = localStorageData.tasks;

  state.taskLists.map((CardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(CardData));
  });
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`;

 

  const input = {
    url: document.getElementById("Imageurl").value,
    title: document.getElementById("Task").value,
    type: document.getElementById("TaskType").value,
    description: document.getElementById("TaskDesc").value,
  };

   if (input.title === "" || input.description === "" || input.type === "") {
    return alert("please fill all the mandatory fields");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({ ...input, id })
  );
  updateLocalStorage();
  state.taskList.push({ ...input, id });
};
