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
    const tasksContainer = document.querySelector('#tasks-container');
    tasksContainer.innerHTML = ''
    if(Object.keys(this.tasks).length) {
      for(let task in this.tasks) {
        tasksContainer.append(this.taskComponent(this.tasks[task]));
      }
    } else {
      console.log('Has no tasks')
    }
  }

  taskComponent(task) {
    const _this = this;
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
    removeBtn.title = 'Remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', function(e) {
      _this.removeTask(e)
    })

    let markCompletedBtn = document.createElement('button');
    markCompletedBtn.setAttribute('data-id', task.id);
    markCompletedBtn.classList.add('mark-completed-btn');
    markCompletedBtn.title = 'Mark Completed';
    markCompletedBtn.innerHTML = '&check; Completed';
    markCompletedBtn.addEventListener('click', function(e) {
      // _this.removeTask(e)
    })

    taskContainer.append(taskTitle, taskContent, taskDate, markCompletedBtn, removeBtn)
    taskComponent.append(taskContainer);

    // this.animations.fadeIn(taskComponent);
    return taskComponent;
  }

  saveTasks(tasks) {
    if(Object.keys(tasks).length) {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
  }

  addTask(values) {
    const tasksContainer = document.querySelector('#tasks-container');
    this.tasks[values.id] = values;
    tasksContainer.append(this.taskComponent(values));
    this.saveTasks(this.tasks);
    this.clearFormInputs();
  }

  removeTask(e) {
    const id = e.target.dataset.id;
    const taskComponent = document.querySelector(`#task-${id}`);
    delete this.tasks[id];
    this.transitions.fadeOut(taskComponent);
    this.saveTasks(this.tasks);
  }

  removeTasks() {
    const tasks = document.querySelectorAll(`.task-wrapper`);
    for(let task of tasks) {
      this.transitions.fadeOut(task);
    }
    this.tasks = {}
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
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
    const inputs = document.querySelectorAll('#task-form input');
    for(let input of inputs) {
      input.value = '';
    }
    
    const checkbox = document.querySelector('#task-form input[type="checkbox"]');
    checkbox.removeAttribute('checked');

    const textarea = document.querySelector('#task-form textarea');
    textarea.value = '';
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
    this.initRemoveAllTasksBtn();
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

  initRemoveAllTasksBtn() {
    const _this = this;
    const addTaskBtn =  document.querySelector('#remove-tasks-btn');
    addTaskBtn.addEventListener('click', async function() {
      _this.removeTasks();
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
    fadeOut: async (el) => {
      el.classList.add('fade-out');
      const animation = setInterval(function() {
        el.remove();
        return true;
      }, 250);
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