import React, { useState } from "react"
import axios from "axios"

function RequestPushimi() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [days, setDays] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        "http://localhost:5000/request",
        { start_date: startDate, end_date: endDate, days },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      alert("Pushimi request submitted successfully")
    } catch (error) {
      console.error("Failed to submit request:", error)
    }
  }

  return (
    <div>
      <h2>Request Pushimi</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="Number of days"
          required
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  )
}

export default RequestPushimi

