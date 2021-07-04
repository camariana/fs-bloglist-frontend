import React, { useState, useEffect } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const Login = ({ blogs, setBlogs }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const loggedInBlogAppUserJSON = window.localStorage.getItem('loggedInBlogAppUser')
    if (loggedInBlogAppUserJSON) {
      const user = JSON.parse(loggedInBlogAppUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user  = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedInBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      //reset the username and password
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 7000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBlogAppUser')
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({
      ...newBlog, [name]: value
    })
  }

  const createBlog = (event) => {
    event.preventDefault()
    
    const { title, author, url } = newBlog;
    const blogObject = { 
      title, 
      author, 
      url
    }

    blogService
      .create(blogObject)
      .then(returnBlog => {
        setBlogs(blogs.concat(returnBlog))
        setNewBlog({ title: '', author: '', url: '' })
      })
      .catch(error => {
        console.log(error.response)
        setErrorMessage(
          //`${error.response.data.error}`
        )
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000)
      })
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          name="username"
          onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password" 
          type="password"
          value={password}
          name="password"
          onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )

  const newBlogForm = () => (
    <form onSubmit={createBlog}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={newBlog.title}
          name="title"
          onChange={handleBlogChange}
        />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          id="author"
          type="text"
          value={newBlog.author}
          name="author"
          onChange={handleBlogChange}
        />
      </div>
      <div>
        <label htmlFor="url">Url</label>
        <input
          id="url"
          type="text"
          value={newBlog.url}
          name="url"
          onChange={handleBlogChange}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )

  const loggedIn = () => (
    <>
      <div>
        <p>{user.name} logged-in</p>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
      {newBlogForm()}
    </>
  )

  return (
    <>
      <p>
        {errorMessage}
      </p> 
      {
        user === null 
        ? loginForm()
        : loggedIn()
      }
    </>
  )
}

export default Login