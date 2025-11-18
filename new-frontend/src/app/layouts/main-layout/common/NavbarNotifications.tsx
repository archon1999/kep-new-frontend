import { useMemo, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Button, Link, Popover, Stack, Tab, Typography, badgeClasses, paperClasses } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { Notification } from 'app/types/notification';
import { notifications as notificationsData } from 'data/notifications';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SimpleBar from 'shared/components/base/SimpleBar';
import NotificationTabPanel from 'shared/components/sections/notification/NotificationTabPanel';
import OutlinedBadge from 'shared/components/styled/OutlinedBadge';

type NotificationTab = 'all' | 'unread';

interface NavbarNotificationsProps {
  type?: 'default' | 'slim';
}

const NavbarNotifications = ({ type = 'default' }: NavbarNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');

  const {
    config: { textDirection },
  } = useSettingsContext();

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications],
  );

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, value: NotificationTab) => {
    setActiveTab(value);
  };

  const handleToggleReadStatus = (id: number, isRead: boolean) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, readAt: isRead ? null : new Date() }
          : notification,
      ),
    );
  };

  const handleItemClick = (notification: Notification) => {
    if (!notification.readAt) {
      handleToggleReadStatus(notification.id, false);
    }
    handleClose();
  };

  const handleRemoveNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.readAt ? notification : { ...notification, readAt: new Date() },
      ),
    );
  };

  const filteredNotifications = useMemo(
    () => (activeTab === 'all' ? notifications : notifications.filter((n) => !n.readAt)),
    [activeTab, notifications],
  );

  return (
    <>
      <Button
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        shape="circle"
        size={type === 'slim' ? 'small' : 'medium'}
        onClick={handleClick}
      >
        <OutlinedBadge
          color="error"
          badgeContent={unreadCount || undefined}
          max={99}
          sx={{
            [`& .${badgeClasses.badge}`]: {
              height: type === 'slim' ? 18 : 22,
              minWidth: type === 'slim' ? 18 : 22,
              fontSize: 12,
              top: -6,
              right: -6,
            },
          }}
        >
          <IconifyIcon
            icon={
              type === 'slim'
                ? 'material-symbols:notifications-outline-rounded'
                : 'material-symbols-light:notifications-outline-rounded'
            }
            sx={{ fontSize: type === 'slim' ? 18 : 22 }}
          />
        </OutlinedBadge>
      </Button>
      <Popover
        anchorEl={anchorEl}
        id="notification-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: textDirection === 'rtl' ? 'left' : 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: {
            width: 400,
            height: 650,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ px: 2, pt: 2, pb: 1, gap: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
              Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {unreadCount} unread
            </Typography>
          </Box>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            disabled={!unreadCount}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </Stack>
        <TabContext value={activeTab}>
          <TabList
            onChange={handleTabChange}
            aria-label="notifications tabs"
            variant="fullWidth"
            sx={{
              px: 2,
              [`& .MuiTab-root`]: {
                minHeight: 0,
                alignItems: 'flex-start',
              },
            }}
          >
            <Tab
              value="all"
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">All</Typography>
                  <OutlinedBadge
                    color="neutral"
                    badgeContent={notifications.length}
                    max={999}
                    sx={{ [`& .${badgeClasses.badge}`]: { fontSize: 11 } }}
                  />
                </Stack>
              }
            />
            <Tab
              value="unread"
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">Unread</Typography>
                  <OutlinedBadge
                    color="error"
                    badgeContent={unreadCount}
                    max={999}
                    sx={{ [`& .${badgeClasses.badge}`]: { fontSize: 11 } }}
                  />
                </Stack>
              }
            />
          </TabList>
          <Box sx={{ pt: 1, flex: 1, overflow: 'hidden' }}>
            <SimpleBar disableHorizontal>
              <NotificationTabPanel
                value="all"
                notificationsData={notifications}
                onItemClick={handleItemClick}
                onRemoveNotification={handleRemoveNotification}
                onToggleReadStatus={handleToggleReadStatus}
              />
              <NotificationTabPanel
                value="unread"
                notificationsData={filteredNotifications}
                onItemClick={handleItemClick}
                onRemoveNotification={handleRemoveNotification}
                onToggleReadStatus={handleToggleReadStatus}
              />
            </SimpleBar>
          </Box>
        </TabContext>
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            py: 1,
          }}
        >
          <Button component={Link} underline="none" href="#!" variant="text" color="primary">
            View all notifications
          </Button>
        </Stack>
      </Popover>
    </>
  );
};

export default NavbarNotifications;
