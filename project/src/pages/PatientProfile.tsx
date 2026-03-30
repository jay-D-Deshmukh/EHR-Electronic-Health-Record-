import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, Activity, Heart, Weight, Droplet, FileText, Download, Calendar } from 'lucide-react';
import {
  mockPatients,
  mockVitals,
  mockMedications,
  mockMedicalHistory,
  mockReports,
  mockAISummaries,
  mockLabResults,
} from '@/data/mockData';
import { useState } from 'react';

export function PatientProfile() {
  const { id } = useParams();
  const patient = mockPatients.find((p) => p.id === id);
  const vitals = mockVitals[id || ''];
  const medications = mockMedications.filter((m) => m.patientId === id);
  const history = mockMedicalHistory.filter((h) => h.patientId === id);
  const reports = mockReports.filter((r) => r.patientId === id);
  const aiSummary = mockAISummaries[id || ''];
  const labResults = mockLabResults.filter((l) => l.patientId === id);
  const [expandedSummary, setExpandedSummary] = useState(false);

  if (!patient) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Patient not found</p>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getAdherenceColor = (adherence: string) => {
    switch (adherence) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>{patient.age} years</span>
                  <span>•</span>
                  <span>{patient.gender}</span>
                  <span>•</span>
                  <span>{patient.bloodGroup}</span>
                  <span>•</span>
                  <span>ID: {patient.id}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="text-sm text-muted-foreground">{patient.email}</span>
                  <span>•</span>
                  <span className="text-sm text-muted-foreground">{patient.phone}</span>
                </div>
              </div>
            </div>
            <Badge className={getRiskColor(patient.riskLevel)} variant="outline">
              {patient.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {aiSummary && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI Summary</CardTitle>
              <span className="text-xs text-muted-foreground">
                Last updated: {new Date(aiSummary.lastUpdated).toLocaleString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed">
                {expandedSummary
                  ? aiSummary.overallSummary
                  : `${aiSummary.overallSummary.substring(0, 150)}...`}
              </p>
              <Button
                variant="link"
                size="sm"
                className="p-0"
                onClick={() => setExpandedSummary(!expandedSummary)}
              >
                {expandedSummary ? 'Show less' : 'Show more'}
              </Button>
              {expandedSummary && (
                <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Vitals Summary</h4>
                    <p className="text-sm text-muted-foreground">{aiSummary.specificSummaries.vitals}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Medications</h4>
                    <p className="text-sm text-muted-foreground">{aiSummary.specificSummaries.medications}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Conditions</h4>
                    <p className="text-sm text-muted-foreground">{aiSummary.specificSummaries.conditions}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {vitals && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Vital Signs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Pressure</p>
                    <p className="text-2xl font-bold">
                      {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
                    </p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                {vitals.trend === 'up' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                    <ArrowUp className="h-3 w-3" />
                    Increasing
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">BMI</p>
                    <p className="text-2xl font-bold">{vitals.bmi}</p>
                    <p className="text-xs text-muted-foreground">kg/m²</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-2xl font-bold">{vitals.weight}</p>
                    <p className="text-xs text-muted-foreground">lbs</p>
                  </div>
                  <Weight className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Sugar</p>
                    <p className="text-2xl font-bold">{vitals.sugarLevel}</p>
                    <p className="text-xs text-muted-foreground">mg/dL</p>
                  </div>
                  <Droplet className="h-8 w-8 text-purple-500" />
                </div>
                {vitals.trend === 'up' && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                    <ArrowUp className="h-3 w-3" />
                    Above target
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${event.type === 'emergency' ? 'bg-red-100' :
                          event.type === 'surgery' ? 'bg-orange-100' :
                            event.type === 'diagnosis' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                        <Calendar className={`h-5 w-5 ${event.type === 'emergency' ? 'text-red-600' :
                            event.type === 'surgery' ? 'text-orange-600' :
                              event.type === 'diagnosis' ? 'text-blue-600' : 'text-green-600'
                          }`} />
                      </div>
                      {index < history.length - 1 && (
                        <div className="h-full w-0.5 bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} • {event.doctor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{med.name}</h4>
                      <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                        <span>{med.dosage}</span>
                        <span>•</span>
                        <span>{med.frequency}</span>
                        <span>•</span>
                        <span>{med.duration}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Started: {new Date(med.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getAdherenceColor(med.adherence)}>
                        {med.adherence}
                      </Badge>
                      <Badge variant={med.status === 'active' ? 'default' : 'secondary'}>
                        {med.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.type} • {new Date(report.uploadDate).toLocaleDateString()}
                        </p>
                        {report.aiSummary && (
                          <p className="mt-1 text-sm text-muted-foreground">{report.aiSummary}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {labResults.map((lab) => (
                  <div
                    key={lab.id}
                    className={`rounded-lg border p-4 ${lab.status === 'critical' ? 'border-red-200 bg-red-50' :
                        lab.status === 'abnormal' ? 'border-yellow-200 bg-yellow-50' :
                          'border-green-200 bg-green-50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{lab.testName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Reference: {lab.referenceRange}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {lab.value} <span className="text-sm font-normal">{lab.unit}</span>
                        </p>
                        <Badge
                          variant={
                            lab.status === 'critical' ? 'destructive' :
                              lab.status === 'abnormal' ? 'default' : 'secondary'
                          }
                        >
                          {lab.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(lab.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
