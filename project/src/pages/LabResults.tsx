import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { mockLabResults } from '@/data/mockData';

export function LabResults() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'destructive';
      case 'abnormal':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const criticalCount = mockLabResults.filter(r => r.status === 'critical').length;
  const abnormalCount = mockLabResults.filter(r => r.status === 'abnormal').length;
  const normalCount = mockLabResults.filter(r => r.status === 'normal').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Laboratory Results</h1>
        <p className="text-muted-foreground">View and analyze test results</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Immediate attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Abnormal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-600">{abnormalCount}</p>
                <p className="text-sm text-muted-foreground">Needs monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Normal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{normalCount}</p>
                <p className="text-sm text-muted-foreground">Within range</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLabResults.map((result) => (
              <div
                key={result.id}
                className={`rounded-lg border p-4 ${
                  result.status === 'critical' ? 'border-red-200 bg-red-50' :
                  result.status === 'abnormal' ? 'border-yellow-200 bg-yellow-50' :
                  'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{result.testName}</h3>
                      <Badge variant={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Result: </span>
                        <span className="font-semibold">{result.value} {result.unit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reference: </span>
                        <span className="font-medium">{result.referenceRange}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date: </span>
                        <span className="font-medium">{new Date(result.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-white">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{result.value}</p>
                      <p className="text-xs text-muted-foreground">{result.unit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
