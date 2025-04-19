
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const EmailTemplateList = () => {
  const templates = [
    { id: 1, name: 'Booking Confirmation', subject: 'Your booking is confirmed' },
    { id: 2, name: 'Check-in Reminder', subject: 'Your check-in is tomorrow' },
    { id: 3, name: 'Check-out Reminder', subject: 'Check-out reminder' },
    { id: 4, name: 'Welcome Email', subject: 'Welcome to our property' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left font-medium p-3">Template Name</th>
              <th className="text-left font-medium p-3">Subject</th>
              <th className="text-right font-medium p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id} className="border-t">
                <td className="p-3 font-medium">{template.name}</td>
                <td className="p-3">{template.subject}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailTemplateList;
