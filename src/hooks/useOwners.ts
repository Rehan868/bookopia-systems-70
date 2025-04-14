
import { owners } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";

export const useOwners = () => {
  return useQuery({
    queryKey: ["owners"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return owners;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOwner = (id: string) => {
  return useQuery({
    queryKey: ["owner", id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const owner = owners.find(o => o.id === id);
      
      if (!owner) {
        throw new Error(`Owner with ID ${id} not found`);
      }
      
      return owner;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
