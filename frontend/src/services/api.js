import { API_URL } from '../config/config'

export async function fetchConversation(user1, user2) {
    const response = await fetch(`${API_URL}/messages/${user1}/${user2}`);
    if(!response.ok) {
        throw new Error('Failed to fetch conversation');
    }
    return response.json();
}

export async function deleteMessage(id) {
    const response = await fetch(`${API_URL}/messages/${id}`, {
        method: "PUT",
    });

    if(!response.ok) {
        throw new Error("Failed to delete message");
    }
}

export async function editMessage(id, senderId, receiverId, content) {
    const response = await fetch(`${API_URL}/messages/update/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ senderId, receiverId, content}),
    });

    if(!response.ok) {
        throw new Error("Failed to delete message");
    }
    return response.json();
}