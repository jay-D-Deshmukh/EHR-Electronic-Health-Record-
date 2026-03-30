import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, TriangleAlert as AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { mockDashboardStats, mockAppointments, mockAlerts, mockPatients } from '@/data/mockData';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date === '2024-03-30'
  );
  const criticalPatients = mockPatients.filter((p) => p.riskLevel === 'critical');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Smith</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">{todayAppointments.filter(a => a.status === 'scheduled').length} scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockDashboardStats.criticalCases}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <Link to="/appointments">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {appointment.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <Link to={`/patients/${appointment.patientId}`}>
                        <p className="font-medium hover:underline">{appointment.patientName}</p>
                      </Link>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {appointment.time}
                    </div>
                    <Badge
                      variant={
                        appointment.status === 'in-progress'
                          ? 'default'
                          : appointment.status === 'completed'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="mt-1"
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Critical Alerts</CardTitle>
              <Badge variant="destructive">{mockAlerts.filter(a => !a.read).length} New</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex gap-4 rounded-lg border p-4 ${
                    alert.type === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Patient ID: {alert.patientId} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>High-Risk Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criticalPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 font-semibold">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <Link to={`/patients/${patient.id}`}>
                      <p className="font-medium hover:underline">{patient.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years • {patient.gender} • {patient.condition}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="destructive">{patient.riskLevel}</Badge>
                  <Link to={`/patients/${patient.id}`}>
                    <Button size="sm">View Profile</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
