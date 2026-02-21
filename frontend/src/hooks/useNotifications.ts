import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Notification } from '@/types/gift';

export const useNotifications = (userId?: string) => {
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', userId],
        queryFn: async () => {
            if (!userId) return [];
            const response = await api.get<Notification[]>(`/notifications/${userId}`);
            return response.data;
        },
        enabled: !!userId,
        refetchInterval: 5000, // Poll every 5 seconds for demo
    });

    const markReadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await api.patch(`/notifications/${notificationId}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        },
    });

    return {
        notifications: notifications || [],
        isLoading,
        markRead: markReadMutation.mutate,
        unreadCount: notifications?.length || 0,
    };
};
