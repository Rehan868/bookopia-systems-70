
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, createExpense, updateExpense } from '@/services/api';
import { useToast } from './use-toast';
import { Expense } from '@/services/supabase-types';

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      if (!id) throw new Error('Expense ID is required');
      
      const expenses = await fetchExpenses();
      const expense = expenses.find(e => e.id === id);
      
      if (!expense) {
        throw new Error(`Expense with ID ${id} not found`);
      }
      
      return expense;
    },
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
      return createExpense(expenseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Expense created',
        description: 'The expense has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create expense',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, expenseData }: { id: string, expenseData: Partial<Expense> }) => {
      return updateExpense(id, expenseData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', variables.id] });
      toast({
        title: 'Expense updated',
        description: 'The expense has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update expense',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
