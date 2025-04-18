
import React from 'react';
import { useProperties } from '@/hooks/useProperties';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PropertiesPage = () => {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) {
    return <div className="p-8">Loading properties...</div>;
  }

  if (error) {
    return <div className="p-8">Error loading properties: {(error as Error).message}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Button>Add New Property</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties && properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>{property.city}</TableCell>
                  <TableCell>{property.country}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {(!properties || properties.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No properties found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPage;
