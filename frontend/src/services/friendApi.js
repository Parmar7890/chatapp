import { API_URL } from '../config/config';

export async function searchUsers(username) {
  const response = await fetch(`${API_URL}/auth/search?username=${username}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}

export async function sendFriendRequest(senderId, receiverId) {
  console.log(senderId, receiverId)
  const response = await fetch(
    `${API_URL}/friend-request?senderId=${senderId}&receiverId=${receiverId}`,
    { method: 'POST' }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send request');
  }
  return response.json();
}

export async function getPendingRequests(userId) {
  const response = await fetch(`${API_URL}/friend-request/pending/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch pending requests');
  return response.json();
}

export async function respondToRequest(requestId, accept) {
  const endpoint = accept ? 'accept' : 'reject';
  const response = await fetch(
    `${API_URL}/friend-request/${requestId}/${endpoint}`,
    { method: 'PUT' }
  );
  if (!response.ok) throw new Error('Failed to respond to request');
  return response.json();
}

export async function getFriends(userId) {
  const response = await fetch(`${API_URL}/friend-request/friends/${userId}`);
   console.log("her55eere",response);
  if (!response.ok) throw new Error('Failed to fetch friends');
  return response.json();
}