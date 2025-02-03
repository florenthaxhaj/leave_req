import axios from "axios"

const API_URL = "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})

export const login = (username: string, password: string) => api.post("/auth/login", { username, password })

export const register = (username: string, password: string, role: string) =>
  api.post("/auth/register", { username, password, role })

export const getLeaveRequests = () => api.get("/pushimi/requests")

export const createLeaveRequest = (startDate: string, endDate: string, type: string) =>
  api.post("/pushimi/request", {
    start_date: startDate,
    end_date: endDate,
    type: type,
    days: calculateDays(new Date(startDate), new Date(endDate)),
  })

export const updateLeaveRequest = (requestId: string, status: string) =>
  api.put(`/pushimi/request/${requestId}`, { status })

export const getUsers = () => api.get("/admin/users")

// Helper function to calculate days between two dates
function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

export default api

