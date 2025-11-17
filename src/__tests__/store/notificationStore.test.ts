import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNotificationStore } from '@store/notificationStore';

describe('useNotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
    vi.clearAllTimers();
  });

  describe('adding notifications', () => {
    it('should add a notification', () => {
      const { addNotification } = useNotificationStore.getState();
      const id = addNotification({
        type: 'success',
        title: 'Success',
        duration: Infinity,
      });
      const state = useNotificationStore.getState();
      expect(state.notifications.length).toBe(1);
      expect(state.notifications[0].id).toBe(id);
    });

    it('should auto-remove notification after duration', () => {
      vi.useFakeTimers();
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        type: 'info',
        title: 'Test',
        duration: 3000,
      });
      expect(useNotificationStore.getState().notifications.length).toBe(1);
      vi.advanceTimersByTime(3000);
      expect(useNotificationStore.getState().notifications.length).toBe(0);
      vi.useRealTimers();
    });

    it('should use default duration of 5000ms', () => {
      vi.useFakeTimers();
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        type: 'info',
        title: 'Test',
      });
      vi.advanceTimersByTime(5000);
      expect(useNotificationStore.getState().notifications.length).toBe(0);
      vi.useRealTimers();
    });

    it('should add notification with action', () => {
      const { addNotification } = useNotificationStore.getState();
      const mockAction = vi.fn();
      addNotification({
        type: 'warning',
        title: 'Warning',
        action: {
          label: 'Fix',
          onClick: mockAction,
        },
        duration: Infinity,
      });
      const notification = useNotificationStore.getState().notifications[0];
      expect(notification.action?.label).toBe('Fix');
    });
  });

  describe('removing notifications', () => {
    it('should remove notification by id', () => {
      const { addNotification, removeNotification } = useNotificationStore.getState();
      const id = addNotification({
        type: 'success',
        title: 'Success',
        duration: Infinity,
      });
      removeNotification(id);
      expect(useNotificationStore.getState().notifications.length).toBe(0);
    });

    it('should not affect other notifications', () => {
      const { addNotification, removeNotification } = useNotificationStore.getState();
      const id1 = addNotification({
        type: 'success',
        title: 'Success 1',
        duration: Infinity,
      });
      const id2 = addNotification({
        type: 'error',
        title: 'Error 1',
        duration: Infinity,
      });
      removeNotification(id1);
      const state = useNotificationStore.getState();
      expect(state.notifications.length).toBe(1);
      expect(state.notifications[0].id).toBe(id2);
    });
  });

  describe('clearing notifications', () => {
    it('should clear all notifications', () => {
      const { addNotification, clearNotifications } = useNotificationStore.getState();
      addNotification({ type: 'info', title: 'Info', duration: Infinity });
      addNotification({ type: 'success', title: 'Success', duration: Infinity });
      clearNotifications();
      expect(useNotificationStore.getState().notifications.length).toBe(0);
    });
  });

  describe('notification types', () => {
    it('should support success type', () => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        type: 'success',
        title: 'Done',
        duration: Infinity,
      });
      expect(useNotificationStore.getState().notifications[0].type).toBe('success');
    });

    it('should support error type', () => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        type: 'error',
        title: 'Error',
        duration: Infinity,
      });
      expect(useNotificationStore.getState().notifications[0].type).toBe('error');
    });

    it('should support warning type', () => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        type: 'warning',
        title: 'Warning',
        duration: Infinity,
      });
      expect(useNotificationStore.getState().notifications[0].type).toBe('warning');
    });

    it('should support info type', () => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        type: 'info',
        title: 'Info',
        duration: Infinity,
      });
      expect(useNotificationStore.getState().notifications[0].type).toBe('info');
    });
  });
});
