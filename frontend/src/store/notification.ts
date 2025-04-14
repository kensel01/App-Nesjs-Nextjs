import { create } from 'zustand';
import { toast } from '@/components/ui/use-toast';

export type NotificationType = 'default' | 'success' | 'destructive' | 'warning';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
  link?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

let notificationIdCounter = 0;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${notificationIdCounter++}`;
    const newNotification: Notification = {
      id,
      ...notification,
      read: false,
      timestamp: new Date(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    // Mostrar un toast con la notificación
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type,
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      
      const unreadCount = notifications.filter((notification) => !notification.read).length;
      
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
      unreadCount: 0,
    }));
  },

  deleteNotification: (id) => {
    set((state) => {
      const notifications = state.notifications.filter(
        (notification) => notification.id !== id
      );
      
      const unreadCount = notifications.filter((notification) => !notification.read).length;
      
      return { notifications, unreadCount };
    });
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
})); 