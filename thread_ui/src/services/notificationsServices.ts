import React from 'react'
import API from './refreshTokenService'

export const getAllNotificationsUser = async () => {
  try {
    const response = await API.get('api/notifications/get-notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export const markNotificationAsRead = async () => {
  try {
    const response = await API.put(`api/notifications/mark-as-read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}