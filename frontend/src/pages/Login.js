import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:5000/login", { username, password })
      localStorage.setItem("token", response.data.access_token)
      history.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login

