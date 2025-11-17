import { useEffect } from 'react';
import { useNotificationStore, Notification } from '@store/notificationStore';
import '@styles/toast.scss';

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotificationStore();

  return (
    <div className={`notification notification--${notification.type}`} role="alert">
      <div className="notification__content">
        <h4 className="notification__title">{notification.title}</h4>
        {notification.message && <p className="notification__message">{notification.message}</p>}
      </div>
      {notification.action && (
        <button
          className="notification__action"
          onClick={() => {
            notification.action?.onClick();
            removeNotification(notification.id);
          }}
        >
          {notification.action.label}
        </button>
      )}
      <button
        className="notification__close"
        onClick={() => removeNotification(notification.id)}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

export function Toast() {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
