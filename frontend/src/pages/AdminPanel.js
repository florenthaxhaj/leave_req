import React, { useState, useEffect } from "react"
import axios from "axios"

function AdminPanel() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setUsers(response.data)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <h2>Admin Panel</h2>
      <h3>Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminPanel

