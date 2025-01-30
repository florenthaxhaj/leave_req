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

export const getLeaveRequests = () => api.get("/leave-requests")

export const createLeaveRequest = (startDate: string, endDate: string, type: string) =>
  api.post("/leave-requests", { start_date: startDate, end_date: endDate, type })

export const updateLeaveRequest = (requestId: string, status: string) =>
  api.put(`/leave-requests/${requestId}`, { status })

export const getUsers = () => api.get("/users")

export default api

