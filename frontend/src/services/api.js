import { API_URL } from '../config/config'

export async function fetchConversation(user1, user2) {
    const response = await fetch(`${API_URL}/messages/${user1}/${user2}`);
    if(!response.ok) {
        throw new Error('Failed to fetch conversation');
    }
    return response.json();
}
