import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Check, Loader as Loader2, FileSearch } from 'lucide-react';
import { mockReports } from '@/data/mockData';

export function Reports() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');
  const [processingSteps] = useState([
    { id: 1, name: 'Upload complete', completed: false },
    { id: 2, name: 'Text extraction', completed: false },
    { id: 3, name: 'Metadata generation', completed: false },
    { id: 4, name: 'AI summary', completed: false },
  ]);

  const handleUpload = () => {
    setUploadStatus('uploading');
    setTimeout(() => setUploadStatus('processing'), 1000);
    setTimeout(() => setUploadStatus('complete'), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-muted-foreground">Upload and manage patient reports</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Report</CardTitle>
          </CardHeader>
          <CardContent>
            {uploadStatus === 'idle' ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">Upload Report</h3>
                <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                <Button className="mt-4" onClick={handleUpload}>
                  Select File
                </Button>
              </div>
            ) : uploadStatus === 'complete' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                  <Check className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Processing Complete</p>
                    <p className="text-sm text-green-700">Report processed successfully</p>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">AI-Generated Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    Blood test results show HbA1c at 7.2%, indicating moderate diabetic control.
                    Lipid panel within normal limits. Kidney function stable. Recommend continued
                    medication adherence and lifestyle modifications.
                  </p>
                </div>
                <Button className="w-full" onClick={() => setUploadStatus('idle')}>
                  Upload Another Report
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border bg-blue-50 p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Processing Report</p>
                    <p className="text-sm text-blue-700">Please wait...</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {processingSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        index === 0 ? 'border-green-200 bg-green-50' : 'bg-slate-50'
                      }`}
                    >
                      {index === 0 ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                      )}
                      <span className="text-sm">{step.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-sm">{report.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {report.type} • {new Date(report.uploadDate).toLocaleDateString()}
                      </p>
                      <Badge className="mt-1" variant={report.status === 'processed' ? 'secondary' : 'default'}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileSearch className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
