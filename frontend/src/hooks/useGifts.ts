import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Gift, GiftStatus, Milestone } from '@/types/gift';

export const useGifts = (userId?: string, role?: 'grandparent' | 'grandchild' | 'trustee') => {
    const queryClient = useQueryClient();

    // Fetch gifts for a specific user role
    const { data: gifts, isLoading, error } = useQuery({
        queryKey: ['gifts', role, userId],
        queryFn: async () => {
            if (!role) return [];
            const endpoint = role === 'trustee' ? '/gifts/' : `/gifts/${role}/${userId}`;
            const response = await api.get<Gift[]>(endpoint);
            return response.data;
        },
        enabled: !!role && (role === 'trustee' || !!userId),
    });

    // Mutation to create a gift
    const createGiftMutation = useMutation({
        mutationFn: async (newGift: any) => {
            const response = await api.post<Gift>(`/gifts/?grandparent_id=${userId}`, newGift);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gifts'] });
        },
    });

    // Mutation to update gift status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ giftId, status }: { giftId: string; status: GiftStatus }) => {
            const response = await api.patch<Gift>(`/gifts/${giftId}/status?next_status=${status}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gifts'] });
        },
    });

    // Mutation to submit/approve milestone (US2)
    const submitMilestoneMutation = useMutation({
        mutationFn: async (milestoneId: string) => {
            const response = await api.post<Milestone>(`/trustee/approve-milestone/${milestoneId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gifts'] });
        },
    });

    return {
        gifts,
        isLoading,
        error,
        createGift: createGiftMutation.mutateAsync,
        updateStatus: updateStatusMutation.mutateAsync,
        submitMilestone: submitMilestoneMutation.mutateAsync,
        isCreating: createGiftMutation.isPending,
        isUpdating: updateStatusMutation.isPending,
        isSubmitting: submitMilestoneMutation.isPending,
    };
};
