"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getLeaveRequests } from "@/lib/api"

type LeaveRequest = {
  _id: string
  start_date: string
  end_date: string
  status: "pending" | "approved" | "rejected"
  type: string
}

export default function Dashboard() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getLeaveRequests()
        setRequests(response.data)
      } catch (error) {
        console.error("Failed to fetch leave requests:", error)
      }
    }
    fetchRequests()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Paneli i Kërkesave për Pushim</CardTitle>
          <CardDescription>Shikoni dhe menaxhoni kërkesat tuaja për pushim</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data e fillimit</TableHead>
                <TableHead>Data e mbarimit</TableHead>
                <TableHead>Lloji</TableHead>
                <TableHead>Statusi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request._id}</TableCell>
                  <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "secondary"
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/request">
            <Button>Bëj Kërkesë të Re</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

