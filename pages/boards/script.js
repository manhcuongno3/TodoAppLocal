const StateOfFilterTasks = Object.freeze({
  ALL: 'all',
  DONE: 'done',
  NOT_DONE: 'not-done'
})

const URL_LOGIN = '../users/login/login.html'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const user =
  JSON.parse(localStorage.getItem('currentUser')) ||
  JSON.parse(sessionStorage.getItem('currentUser'))
let listTask = JSON.parse(localStorage.getItem('listTask')) || []

function generateId () {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

class TaskManager {
  constructor (tasks = []) {
    this.tasks = tasks
    this.currentFilter = StateOfFilterTasks.ALL
    this.currentTaskId = null

    this.taskList = $('.list__task')
    this.addTaskButton = $('.add__button')
    this.clearTaskNameButton = $('.clear__button')
    this.filterTaskInput = $('#filter')
    this.cancelAddTaskButton = $$('.cancel-modal')
    this.editTaskModal = $('.modal')
    this.saveTaskButton = $$('.save-modal')

    this.addEventListeners()
    this.renderTasks()
  }

  addEventListeners () {
    this.addTaskButton.addEventListener('click', () => this.addTask())
    this.cancelAddTaskButton.forEach(button =>
      button.addEventListener('click', () => this.cancelEdit())
    )
    this.saveTaskButton.forEach(button =>
      button.addEventListener('click', () => this.saveEdit())
    )
    this.filterTaskInput.addEventListener('change', () => this.filterTasks())
    this.clearTaskNameButton.addEventListener('click', () => this.clearAdd())
  }

  filterTasks () {
    this.currentFilter = this.filterTaskInput.value
    this.renderTasks()
  }

  clearAdd () {
    $('.add__input').value = ''
  }

  addTask () {
    const taskNameInput = $('.add__input')
    const taskName = taskNameInput.value.trim()

    if (taskName) {
      if (this.currentFilter === StateOfFilterTasks.DONE) {
        this.currentFilter = StateOfFilterTasks.ALL
        this.filterTaskInput.value = StateOfFilterTasks.ALL
      }
      const newTask = {
        id: generateId(),
        name: taskName,
        isDone: false,
        ownerId: user.id
      }
      this.tasks.push(newTask)
      listTask.push(newTask)
      this.updateStorage()
      taskNameInput.value = ''
      this.renderTasks()
    }
  }

  editTask (id) {
    this.currentTaskId = id
    const editInput = $('.edit__input')
    editInput.value = this.tasks.find(task => task.id === id).name
    this.toggleModal(this.editTaskModal, true)
  }

  saveEdit () {
    const newName = $('.edit__input').value

    if (newName) {
      this.tasks = this.tasks.map(task =>
        task.id === this.currentTaskId ? { ...task, name: newName } : task
      )
      listTask = listTask.map(task =>
        task.id === this.currentTaskId ? { ...task, name: newName } : task
      )
      this.toggleModal(this.editTaskModal, false)
      this.updateStorage()
      this.renderTasks()
    }
  }

  cancelEdit () {
    this.toggleModal(this.editTaskModal, false)
  }

  deleteTask (id) {
    this.tasks = this.tasks.filter(task => task.id !== id)
    listTask = listTask.filter(task => task.id !== id)

    this.updateStorage()
    this.renderTasks()
  }

  toggleTask (id) {
    this.tasks = this.tasks = this.tasks.map(task =>
      task.id === id ? { ...task, isDone: !task.isDone } : task
    )
    listTask = listTask.map(task =>
      task.id === id ? { ...task, isDone: !task.isDone } : task
    )
    this.updateStorage()
    this.renderTasks()
  }

  updateStorage () {
    localStorage.setItem('listTask', JSON.stringify(listTask))
  }

  renderTasks () {
    this.taskList.innerHTML = ''

    const filteredTasks = this.tasks.filter(task => {
      switch (this.currentFilter) {
        case StateOfFilterTasks.DONE:
          return task.isDone
        case StateOfFilterTasks.NOT_DONE:
          return !task.isDone
        case StateOfFilterTasks.ALL:
        default:
          return true
      }
    })

    filteredTasks.forEach(task => {
      const taskItem = this.createTaskItem(task)
      this.taskList.appendChild(taskItem)
    })
  }

  createTaskItem (task) {
    const taskItem = document.createElement('li')
    taskItem.innerHTML = `
      <input class="check-box" type="checkbox" 
             ${task.isDone ? 'checked' : ''} 
             onclick="taskManager.toggleTask('${task.id}')">
      <span class="task-name">${task.name}</span>
      <button onclick="taskManager.editTask('${task.id}')">Edit</button>
      <button class="red-button" onclick="taskManager.deleteTask('${
        task.id
      }')">Delete</button>
    `
    return taskItem
  }

  toggleModal (modal, show) {
    modal.classList.toggle('open', show)
  }
}

window.onload = function () {
  if (user) {
    $('.username').textContent = `Hello, ${user.username}`
  } else {
    window.location.href = URL_LOGIN
  }
}

function logout () {
  localStorage.removeItem('currentUser')
  sessionStorage.removeItem('currentUser')
  window.location.href = URL_LOGIN
}

const listUserTask = listTask.filter(task => task.ownerId === user?.id)
const taskManager = new TaskManager(listUserTask)
