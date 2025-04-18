
import React from 'react';
import { useCleaningTasks } from '@/hooks/useCleaningTasks';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const CleaningTasksPage = () => {
  const { data: tasks, isLoading, error } = useCleaningTasks();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="p-8">Loading cleaning tasks...</div>;
  }

  if (error) {
    return <div className="p-8">Error loading cleaning tasks: {(error as Error).message}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cleaning Tasks</h1>
        <Button>Add New Task</Button>
      </div>

      <div className="grid gap-6">
        {tasks && tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="bg-muted pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Room: {task.rooms?.number || 'Unknown Room'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(task.date).toLocaleDateString()} | 
                    Assigned to: {task.users?.name || 'Unassigned'}
                  </p>
                </div>
                <Badge 
                  className="capitalize"
                  variant={
                    task.status === 'completed' ? 'success' :
                    task.status === 'in-progress' ? 'warning' :
                    task.status === 'verified' ? 'success' :
                    task.status === 'issues' ? 'destructive' : 'outline'
                  }
                >
                  {task.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-sm">
                {task.notes || 'No special instructions'}
              </div>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button size="sm" variant="outline">View Details</Button>
                <Button size="sm" variant="outline">Update Status</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!tasks || tasks.length === 0) && (
          <div className="text-center p-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">No cleaning tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleaningTasksPage;
