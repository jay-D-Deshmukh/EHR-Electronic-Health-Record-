import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pill } from 'lucide-react';
import { mockMedications } from '@/data/mockData';

export function Medications() {
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

  const activeMeds = mockMedications.filter(m => m.status === 'active');
  const completedMeds = mockMedications.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medications</h1>
          <p className="text-muted-foreground">Manage patient medications</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold">{activeMeds.length}</p>
              <p className="text-sm text-muted-foreground">Currently prescribed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Excellent Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {activeMeds.filter(m => m.adherence === 'excellent').length}
              </p>
              <p className="text-sm text-muted-foreground">Patients on track</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-600">
                {activeMeds.filter(m => m.adherence === 'poor').length}
              </p>
              <p className="text-sm text-muted-foreground">Poor adherence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeMeds.map((medication) => (
              <div
                key={medication.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Pill className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{medication.name}</h3>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span>{medication.dosage}</span>
                      <span>•</span>
                      <span>{medication.frequency}</span>
                      <span>•</span>
                      <span>{medication.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Started: {new Date(medication.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getAdherenceColor(medication.adherence)}>
                    {medication.adherence}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {completedMeds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedMeds.map((medication) => (
                <div
                  key={medication.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 opacity-60"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                      <Pill className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{medication.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {medication.dosage} • {medication.frequency}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
