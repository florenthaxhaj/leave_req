"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getUsers, getLeaveRequests, updateLeaveRequest } from "@/lib/api"

type User = {
  _id: string
  username: string
  role: string
}

type LeaveRequest = {
  _id: string
  user_id: string
  username: string
  start_date: string
  end_date: string
  status: "pending" | "approved" | "rejected"
  type: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [requests, setRequests] = useState<LeaveRequest[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, requestsResponse] = await Promise.all([getUsers(), getLeaveRequests()])
        setUsers(usersResponse.data)
        setRequests(requestsResponse.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await updateLeaveRequest(id, "approved")
      setRequests(requests.map((req) => (req._id === id ? { ...req, status: "approved" } : req)))
    } catch (error) {
      console.error(`Failed to approve request ${id}:`, error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateLeaveRequest(id, "rejected")
      setRequests(requests.map((req) => (req._id === id ? { ...req, status: "rejected" } : req)))
    } catch (error) {
      console.error(`Failed to reject request ${id}:`, error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Menaxhimi i Përdoruesve</CardTitle>
          <CardDescription>Shikoni dhe menaxhoni përdoruesit e sistemit</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Emri i përdoruesit</TableHead>
                <TableHead>Roli</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menaxhimi i Kërkesave për Pushim</CardTitle>
          <CardDescription>Shikoni dhe menaxhoni kërkesat për pushim</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Përdoruesi</TableHead>
                <TableHead>Data e fillimit</TableHead>
                <TableHead>Data e mbarimit</TableHead>
                <TableHead>Lloji</TableHead>
                <TableHead>Statusi</TableHead>
                <TableHead>Veprimet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request._id}</TableCell>
                  <TableCell>{request.username}</TableCell>
                  <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "success"
                          : request.status === "rejected"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {request.status === "approved"
                        ? "Aprovuar"
                        : request.status === "rejected"
                          ? "Refuzuar"
                          : "Në pritje"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <>
                        <Button size="sm" className="mr-2" onClick={() => handleApprove(request._id)}>
                          Aprovo
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(request._id)}>
                          Refuzo
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

