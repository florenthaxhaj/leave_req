import React, { useState, useEffect } from "react"
import axios from "axios"

function Dashboard() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/requests", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setRequests(response.data)
      } catch (error) {
        console.error("Failed to fetch requests:", error)
      }
    }

    fetchRequests()
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Pushimi Requests</h3>
      <ul>
        {requests.map((request, index) => (
          <li key={index}>
            {request.employee} - From: {request.start_date} To: {request.end_date} - Status: {request.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard

