import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function Messages() {
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Dr. Emily Wilson',
      lastMessage: 'Patient chart reviewed',
      time: '10:30 AM',
      unread: 2,
    },
    {
      id: 2,
      name: 'Nurse Sarah',
      lastMessage: 'Vitals updated for P001',
      time: '9:15 AM',
      unread: 0,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Dr. Emily Wilson',
      content: 'I reviewed the latest lab results for Patient P001',
      timestamp: '10:25 AM',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      content: 'Thanks! What are your thoughts on the HbA1c levels?',
      timestamp: '10:27 AM',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'Dr. Emily Wilson',
      content: 'The levels are slightly elevated. I recommend adjusting the Metformin dosage.',
      timestamp: '10:30 AM',
      isOwn: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your team</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {conv.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{conv.name}</p>
                      <p className="text-xs text-muted-foreground">{conv.lastMessage}</p>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      {conv.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                EW
              </div>
              <div>
                <CardTitle className="text-lg">Dr. Emily Wilson</CardTitle>
                <p className="text-xs text-muted-foreground">Active now</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-96 space-y-4 overflow-y-auto rounded-lg border p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg p-3 ${msg.isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                        }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`mt-1 text-xs ${msg.isOwn ? 'text-blue-100' : 'text-slate-500'
                          }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
