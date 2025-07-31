"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Payment {
  id: string
  studentName: string
  studentEmail: string
  amount: number
  course: string
  status: "completed" | "pending" | "failed"
  date: string
  method: string
  transactionId: string
}

interface PaymentForm {
  studentId: string
  amount: string
  course: string
  description: string
  dueDate: string
}

export default function PaymentInterface() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      studentName: "Alice Johnson",
      studentEmail: "alice@example.com",
      amount: 299.99,
      course: "Mathematics",
      status: "completed",
      date: "2024-01-15",
      method: "Credit Card",
      transactionId: "TXN001",
    },
    {
      id: "2",
      studentName: "Bob Smith",
      studentEmail: "bob@example.com",
      amount: 199.99,
      course: "Physics",
      status: "pending",
      date: "2024-01-16",
      method: "Bank Transfer",
      transactionId: "TXN002",
    },
    {
      id: "3",
      studentName: "Carol Davis",
      studentEmail: "carol@example.com",
      amount: 249.99,
      course: "Chemistry",
      status: "failed",
      date: "2024-01-17",
      method: "Credit Card",
      transactionId: "TXN003",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    studentId: "",
    amount: "",
    course: "",
    description: "",
    dueDate: "",
  })

  const students = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com" },
    { id: "2", name: "Bob Smith", email: "bob@example.com" },
    { id: "3", name: "Carol Davis", email: "carol@example.com" },
    { id: "4", name: "David Wilson", email: "david@example.com" },
  ]

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Calendar className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const handleProcessPayment = async () => {
    // Validation
    if (!paymentForm.studentId || !paymentForm.amount || !paymentForm.course) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Student, Amount, Course).",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(paymentForm.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const selectedStudent = students.find((s) => s.id === paymentForm.studentId)
      if (selectedStudent) {
        const newPayment: Payment = {
          id: Date.now().toString(),
          studentName: selectedStudent.name,
          studentEmail: selectedStudent.email,
          amount: Number.parseFloat(paymentForm.amount),
          course: paymentForm.course,
          status: "pending",
          date: new Date().toISOString().split("T")[0],
          method: "Manual Entry",
          transactionId: `TXN${Date.now().toString().slice(-6)}`,
        }

        setPayments([newPayment, ...payments])

        // Reset form
        setPaymentForm({
          studentId: "",
          amount: "",
          course: "",
          description: "",
          dueDate: "",
        })

        toast({
          title: "Payment Processed Successfully! 🎉",
          description: `Payment of $${paymentForm.amount} for ${selectedStudent.name} has been created.`,
        })
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing the payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearForm = () => {
    setPaymentForm({
      studentId: "",
      amount: "",
      course: "",
      description: "",
      dueDate: "",
    })
    toast({
      title: "Form Cleared",
      description: "All form fields have been reset.",
    })
  }

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  const isFormValid = paymentForm.studentId && paymentForm.amount && paymentForm.course

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "pending").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((payments.filter((p) => p.status === "completed").length / payments.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="process">Process Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {payment.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{payment.studentName}</h3>
                          <Badge className={getStatusColor(payment.status)}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1">{payment.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{payment.studentEmail}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{payment.course}</span>
                          <span>•</span>
                          <span>{payment.method}</span>
                          <span>•</span>
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold">${payment.amount}</div>
                      <div className="text-xs text-muted-foreground">ID: {payment.transactionId}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Payment history will appear here once transactions are processed."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Process New Payment
              </CardTitle>
              <CardDescription>Create a payment request or record a manual payment for a student.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="student">Select Student *</Label>
                  <Select
                    value={paymentForm.studentId}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, studentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{student.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <Select
                    value={paymentForm.course}
                    onValueChange={(value) => setPaymentForm({ ...paymentForm, course: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={paymentForm.dueDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  placeholder="Payment description or notes"
                />
              </div>

              {/* Form Status Indicator */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full ${isFormValid ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className={isFormValid ? "text-green-700" : "text-red-700"}>
                    {isFormValid ? "Form is ready to submit" : "Please fill in all required fields (*)"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleProcessPayment}
                  disabled={!isFormValid || isProcessing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Payment
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClearForm} disabled={isProcessing}>
                  Clear Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
