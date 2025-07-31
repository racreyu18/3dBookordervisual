"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, Calendar } from "lucide-react"
import { Users } from "lucide-react" // Import Users icon

interface Student {
  id: string
  name: string
  email: string
  phone: string
  course: string
  status: "active" | "inactive" | "pending"
  joinDate: string
  progress: number
  avatar?: string
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 234 567 8901",
      course: "Mathematics",
      status: "active",
      joinDate: "2024-01-15",
      progress: 85,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 234 567 8902",
      course: "Physics",
      status: "active",
      joinDate: "2024-02-01",
      progress: 72,
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@example.com",
      phone: "+1 234 567 8903",
      course: "Chemistry",
      status: "pending",
      joinDate: "2024-03-10",
      progress: 45,
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 234 567 8904",
      course: "Biology",
      status: "inactive",
      joinDate: "2024-01-20",
      progress: 30,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    status: "pending" as const,
  })

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddStudent = () => {
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      joinDate: new Date().toISOString().split("T")[0],
      progress: 0,
    }
    setStudents([...students, student])
    setNewStudent({ name: "", email: "", phone: "", course: "", status: "pending" })
    setIsAddDialogOpen(false)
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
  }

  const handleUpdateStudent = () => {
    if (editingStudent) {
      setStudents(students.map((s) => (s.id === editingStudent.id ? editingStudent : s)))
      setEditingStudent(null)
    }
  }

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const StudentForm = ({
    student,
    onSave,
    onCancel,
  }: {
    student: any
    onSave: () => void
    onCancel: () => void
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={student.name}
            onChange={(e) =>
              student === newStudent
                ? setNewStudent({ ...newStudent, name: e.target.value })
                : setEditingStudent({ ...editingStudent!, name: e.target.value })
            }
            placeholder="Enter student name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={student.email}
            onChange={(e) =>
              student === newStudent
                ? setNewStudent({ ...newStudent, email: e.target.value })
                : setEditingStudent({ ...editingStudent!, email: e.target.value })
            }
            placeholder="Enter email address"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={student.phone}
            onChange={(e) =>
              student === newStudent
                ? setNewStudent({ ...newStudent, phone: e.target.value })
                : setEditingStudent({ ...editingStudent!, phone: e.target.value })
            }
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Select
            value={student.course}
            onValueChange={(value) =>
              student === newStudent
                ? setNewStudent({ ...newStudent, course: value })
                : setEditingStudent({ ...editingStudent!, course: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="English">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={student.status}
          onValueChange={(value) =>
            student === newStudent
              ? setNewStudent({ ...newStudent, status: value as any })
              : setEditingStudent({ ...editingStudent!, status: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>{student === newStudent ? "Add Student" : "Update Student"}</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the student's information to add them to your class.</DialogDescription>
            </DialogHeader>
            <StudentForm student={newStudent} onSave={handleAddStudent} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Students Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.course}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {student.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(student.joinDate).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
              </div>

              <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditStudent(student)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>Update the student's information.</DialogDescription>
                  </DialogHeader>
                  {editingStudent && (
                    <StudentForm
                      student={editingStudent}
                      onSave={handleUpdateStudent}
                      onCancel={() => setEditingStudent(null)}
                    />
                  )}
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteStudent(student.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first student."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Student
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
