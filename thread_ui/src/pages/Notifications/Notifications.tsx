import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faUserPlus,
  faShare,
  faEllipsisH,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  getAllNotificationsUser,
  markNotificationAsRead,
} from "../../services/notificationsServices";
import { Link } from "react-router-dom";
import { NotificationPayload } from "../../types/NotificationType";
import { InfoUser } from "../../types/AuthType";
import { useNotificationsHub } from "../../hook/useNotificationsHub";
import moment from "moment";

// Constants
const NOTIFICATION_TABS = [
  { key: 0, label: "Thích" },
  { key: 1, label: "Bình luận" },
  { key: 2, label: "Theo dõi" },
  { key: 3, label: "Tất cả" },
  { key: 4, label: "Chưa đọc" },
] as const;

const NOTIFICATION_ICONS = {
  0: { icon: faHeart, color: "text-red-500" },
  1: { icon: faComment, color: "text-blue-500" },
  2: { icon: faUserPlus, color: "text-green-500" },
  3: { icon: faShare, color: "text-purple-500" },
  default: { icon: faBell, color: "text-gray-500" },
} as const;

const Notifications: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<number>(3);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selectors
  const user: InfoUser = useSelector((state: RootState) => state.auth);

  // Custom hooks
  const { connection, ReceiverNotification } = useNotificationsHub();

  // Set document title
  useEffect(() => {
    document.title = "Thông báo | Threads.net";
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getAllNotificationsUser();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  //Mark-as-read notifications
  const handleMarkAsRead = async () => {
    try {
      const response = await markNotificationAsRead();
      if (response) {
        setNotifications((prev) =>
          prev.map((n) => (n.isRead ? n : { ...n, isRead: true }))
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle real-time notifications
  useEffect(() => {
    if (!connection) return;

    ReceiverNotification((data: NotificationPayload) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      connection.off("SendNotification");
    };
  }, [connection, ReceiverNotification]);

  // Helper functions
  const getNotificationIcon = useCallback((type: number) => {
    return (
      NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] ||
      NOTIFICATION_ICONS.default
    );
  }, []);

  const getFilteredNotifications = useCallback(() => {
    return notifications.filter((notification) => {
      // Don't show user's own notifications
      if (notification.user.username === user.username) return false;

      switch (activeTab) {
        case 3: // Tất cả
          return true;
        case 4: // Chưa đọc
          return !notification.isRead;
        default: // Specific type
          return notification.type === activeTab;
      }
    });
  }, [notifications, activeTab, user.username]);

  const getTabCount = useCallback(
    (tabKey: number) => {
      const filtered = getFilteredNotifications();

      switch (tabKey) {
        case 3: // Tất cả
          return filtered.length;
        case 4: // Chưa đọc
          return filtered.filter((n) => !n.isRead).length;
        default: // Specific type
          return notifications.filter(
            (n) => n.user.username !== user.username && n.type === tabKey
          ).length;
      }
    },
    [notifications, user.username, getFilteredNotifications]
  );

  const hasUnreadNotifications = useCallback(() => {
    return notifications.some((n) => !n.isRead);
  }, [notifications]);

  // Render functions
  const renderTabs = () => (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {NOTIFICATION_TABS.map((tab) => {
        const count = getTabCount(tab.key);
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12 text-gray-500">
      <FontAwesomeIcon icon={faBell} className="text-4xl mb-3 opacity-50" />
      <p className="text-lg">Không có thông báo nào</p>
      <p className="text-sm">Các thông báo mới sẽ xuất hiện ở đây</p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="text-center py-12 text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
      <p className="text-sm">Đang tải thông báo...</p>
    </div>
  );

  const renderNotification = (notification: NotificationPayload) => {
    const { icon, color } = getNotificationIcon(notification.type);

    return (
      <div
        key={notification.id}
        className={`flex items-start gap-3 p-4 rounded-lg transition-all hover:bg-gray-50 cursor-pointer group ${
          !notification.isRead
            ? "bg-blue-50 border-l-4 border-blue-500"
            : "bg-white"
        }`}
      >
        {/* Avatar + Icon */}
        <div className="relative flex-shrink-0">
          <img
            src={notification.user.avatarURL}
            alt={notification.user.displayName}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={icon} className={`text-xs ${color}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <Link
                  to={`/profile/${notification.user.username}`}
                  className="font-semibold hover:underline"
                >
                  {notification.user.displayName}
                </Link>{" "}
                {notification.content}
              </p>

              {notification.postPreview && (
                <p className="text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                  "{notification.postPreview}"
                </p>
              )}

              <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                <span>
                  {moment(notification.createdAt).format("HH:mm - DD/MM/YYYY")}
                </span>
                {!notification.isRead && (
                  <span
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    title="Chưa đọc"
                  ></span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Tùy chọn khác"
              >
                <FontAwesomeIcon
                  icon={faEllipsisH}
                  className="text-gray-400 text-sm"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMarkAllAsReadButton = () =>
    hasUnreadNotifications() && (
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          onClick={handleMarkAsRead}
        >
          Đánh dấu tất cả là đã đọc
        </button>
      </div>
    );

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold text-gray-800 mb-5">Thông báo</h3>

      <div className="w-[90vh] max-w-[90vh] border border-slate-200 px-5 py-5 rounded-md bg-white shadow-sm">
        {renderTabs()}

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {isLoading
            ? renderLoadingState()
            : filteredNotifications.length === 0
            ? renderEmptyState()
            : filteredNotifications.map(renderNotification)}
        </div>

        {renderMarkAllAsReadButton()}
      </div>
    </div>
  );
};

export default Notifications;
