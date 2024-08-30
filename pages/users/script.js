const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function genarateId () {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

window.onload = function () {
  const user =
    JSON.parse(localStorage.getItem('currentUser')) ||
    JSON.parse(sessionStorage.getItem('currentUser'))
  if (user) {
    window.location.href = '../../boards/index.html'
  }
}

function handleLogin () {
  const username = $('#username').value
  const password = $('#password').value
  const remember = $('#remember').checked
  const users = JSON.parse(localStorage.getItem('users')) || []
  const existedUser = users.find(
    user => user.username === username && user.password === password
  )
  if (!existedUser) {
    alert('Username or Password is incorrect')
    return
  }
  const currentUser = users.find(user => user.username === username)
  if (remember) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
  }
  window.location.href = '../../boards/index.html'
}

function handleRegister () {
  const username = $('#username').value
  const password = $('#password').value
  const repeatPassword = $('#repeat-password').value
  const users = JSON.parse(localStorage.getItem('users')) || []

  const isUserExisted = users.some(user => user.username === username)
  if (password !== repeatPassword) {
    alert('Password does not match')
    return
  }
  if (isUserExisted) {
    alert('Username is already existed')
    return
  }

  users.push({ id: genarateId(), username, password })
  localStorage.setItem('users', JSON.stringify(users))
  window.location.href = '../login/login.html'
}
