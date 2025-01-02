class NotificationManager {
  static show(message) {
    const notification = document.createElement('div');
    notification.className = 'notification animate__animated animate__fadeIn';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }
}
