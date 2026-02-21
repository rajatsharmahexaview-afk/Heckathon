import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface GrowthPoint {
    year: number;
    value: number;
    label: string;
}

export const useSimulation = (giftId?: string) => {
    const { data: projection, isLoading, error } = useQuery({
        queryKey: ['simulation', giftId],
        queryFn: async () => {
            if (!giftId) return [];
            const response = await api.get<GrowthPoint[]>(`/simulation/growth/${giftId}`);
            return response.data;
        },
        enabled: !!giftId,
    });

    return {
        projection,
        isLoading,
        error,
    };
};
