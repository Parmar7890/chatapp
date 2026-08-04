const API_BASE_URL = 'http://localhost:8080/api/auth';

export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw { response: { data: errorData } };
  }

  return await response.json();
};

export const loginUser = async (loginData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw { response: { data: errorData } };
  }

  return await response.json();
};