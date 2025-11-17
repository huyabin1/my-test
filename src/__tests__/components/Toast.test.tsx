import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '@components/Toast';
import { useNotificationStore } from '@store/notificationStore';

describe('Toast', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
  });

  it('should render empty when no notifications', () => {
    const { container } = render(<Toast />);
    const toastContainer = container.querySelector('.toast-container');
    expect(toastContainer?.children.length).toBe(0);
  });

  it('should render notification', () => {
    render(<Toast />);
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'success',
      title: 'Success!',
      duration: Infinity,
    });
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('should display notification message', () => {
    render(<Toast />);
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'Something went wrong',
      duration: Infinity,
    });
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should close notification on close button click', async () => {
    render(<Toast />);
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'info',
      title: 'Info',
      duration: Infinity,
    });
    const closeButton = screen.getByLabelText('Close notification');
    await userEvent.click(closeButton);
    expect(screen.queryByText('Info')).not.toBeInTheDocument();
  });

  it('should support multiple notifications', () => {
    render(<Toast />);
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'success',
      title: 'First',
      duration: Infinity,
    });
    addNotification({
      type: 'error',
      title: 'Second',
      duration: Infinity,
    });
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('should apply correct class for notification type', () => {
    const { container } = render(<Toast />);
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'success',
      title: 'Success',
      duration: Infinity,
    });
    const notification = container.querySelector('.notification--success');
    expect(notification).toBeInTheDocument();
  });

  it('should trigger action when action button clicked', async () => {
    render(<Toast />);
    const mockAction = vi.fn();
    const { addNotification } = useNotificationStore.getState();
    addNotification({
      type: 'info',
      title: 'Undo available',
      action: {
        label: 'Undo',
        onClick: mockAction,
      },
      duration: Infinity,
    });
    const actionButton = screen.getByText('Undo');
    await userEvent.click(actionButton);
    expect(mockAction).toHaveBeenCalled();
  });
});

import { vi } from 'vitest';
