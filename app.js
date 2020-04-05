window.addEventListener('load', function () {
  const App = new TasksApp();
})

class TasksApp {
  constructor() {
    this.init();
  }

  init() {
    console.log('initializing app');
    this.renderTasks();
    this.initForm();
    this.initUI();
  }

  getTasks() {
    console.log('getting tasks');
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : {};
  }

  renderTasks() {
    this.tasks = this.getTasks();
    const tasksContainer = document.querySelector('#task-container');
    tasksContainer.innerHTML = ''
    if(Object.keys(this.tasks).length) {
      for(let task in this.tasks) {
        console.log(task)
        tasksContainer.append(this.taskComponent(task));
      }
    } else {
      console.log('Has no tasks')
    }
  }

  taskComponent(task) {
    let taskComponent = document.createElement('div');
    taskComponent.id = `task-${task.id}`;
    taskComponent.setAttribute('data-id', task.id)
    taskComponent.classList.add('task-wrapper');

    let taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

    let taskTitle = document.createElement('h2');
    taskTitle.innerText = task.title;

    let taskContent = document.createElement('p');
    taskContent.innerText = task.content;

    let taskDate = document.createElement('p');
    taskDate.innerText = task.date;

    let removeBtn = document.createElement('button');
    removeBtn.setAttribute('data-id', task.id);
    removeBtn.classList.add('remove-btn');
    removeBtn.innerHTML = '&times;'

    taskContainer.append(taskTitle, taskContent, taskDate)
    taskComponent.append(taskContainer)

    // this.animations.fadeIn(taskComponent);
    return taskComponent;
  }

  saveTasks(tasks) {
    if(Object.keys(tasks).length) {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
  }

  addTask(values) {
    const tasksContainer = document.querySelector('#task-container');
    this.tasks[values.id] = values;
    tasksContainer.append(this.taskComponent(task));
    this.saveTasks(this.tasks);
  }

  removeTask() {

  }

  handleFormSubmit(e) {
    const _this = this;
    console.log(_this);
    const form = document.querySelector('#task-form');
    if(form.checkValidity()) {
      e.preventDefault();
      console.log('is valid');
      const form = document.querySelector('#task-form');
      const title = document.querySelector('#task-form input[name="title"]').value;
      const content = document.querySelector('#task-form textarea[name="content"]').value;
      const dateObj = new Date(document.querySelector('#task-form input[name="date"]').value);
      let date = dateObj.getTime();
      const important = document.querySelector('input[name="important"]').checked;
      let values = 
        { 
          id: Date.now(),
          title,
          content,
          date,
          important
        }
      _this.addTask(values)
    }
  }

  clearFormInputs() {

  }

  initForm() {
    const _this = this;
    const form = document.querySelector('#task-form');
    const submitBtn = document.querySelector('#task-form button[type="submit"]');
    submitBtn.addEventListener('click', function(e) { 
      _this.handleFormSubmit(e); 
    })
  }

  initUI() {
    this.initAddTaskBtn();
    this.initClosePanelBtn();
  }

  initAddTaskBtn() {
    const _this = this;
    const addTaskBtn =  document.querySelector('#add-task-btn');
    addTaskBtn.addEventListener('click', async function() {
      const taskFormPanel = document.querySelector('#task-form-panel');
      let isPanelOpen = await _this.transitions.slideOut(taskFormPanel);
      // const panelsAreClosed =_this.closeAllPanels();
      // if(panelsAreClosed) _this.transitions.slideIn(addTaskBtn);
    })
  }

  initClosePanelBtn() {
    const _this = this;
    let btns = document.querySelectorAll('.close-panel-btn');
    for(let btn of btns) {
      btn.addEventListener('click', function(e) {
        const panel = e.target.parentElement;
        _this.clearFormInputs();
        // slide out
        _this.transitions.slideIn(panel);
      })
    }
  }


  openPanel() {

  }

  closePanel() {

  }

  async closeAllPanels() {
    console.log('closing all open panels');
    let openPanel = document.querySelectorAll(`.panel.open`);    
  }

  transitions = {
    fadeOut: () => {

    },
    fadeIn: () => {

    },
    slideOut: async (el) => {
      el.classList.add('slide-out')
      el.classList.remove('hidden');
      const animation = setInterval(function() {
        el.classList.remove('slide-in');
        clearInterval(animation);
        return true;
      },
      250)
    },
    slideIn: async (el) => {
      el.classList.add('slide-in');
      el.classList.remove('slide-out');
      const animation = setInterval(function() {
        console.log('adding hidden');
        el.classList.add('hidden');
        clearInterval(animation);
        return true;
      },
      250)
    }

  }
}