const API_URL = 'http://localhost:5000/api';

export const createRoom = async (roomName, token) => {
  const response = await fetch(`${API_URL}/rooms/create-room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name: roomName }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось создать комнату');
  }

  return data;
};

export const getUserRooms = async (token) => {
  const response = await fetch(`${API_URL}/rooms`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список комнат');
  }

  return data;
};

export const joinRoom = async (invitationCode, token) => {
  const response = await fetch(`${API_URL}/rooms/join/${invitationCode}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ code: invitationCode }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось присоединиться к комнате');
  }

  return data;
};




export const getRoomDetails = async (token, roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Ошибка получения данных комнаты');
  return data;
};

export const updateInviteCode = async (token, roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/invite-code`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Ошибка обновления кода приглашения');
  return data;
};

export const toggleRoomAccess = async (token, roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/toggle-access`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Ошибка изменения доступа к комнате');
  return data;
};

export const deleteRoom = async (token, roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Ошибка удаления комнаты');
};

export const removeParticipant = async (token, roomId, participantId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/participants/${participantId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Ошибка удаления участника');
  return data;
};

export const leaveRoom = async (token, roomId) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/leave`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Ошибка при выходе из комнаты');
};

export const saveRoomDescription = async (roomId, token, description) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/description`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    throw new Error('Не удалось сохранить описание комнаты');
  }

  return await response.json();
};


export const startGroupSearch = async (roomId, token) => {
  const response = await fetch(`${API_URL}/rooms/${roomId}/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось начать поиск группы');
  }

  return await response.json();
};

export const acceptGroupMatch = async (matchId, roomId, token) => {
  const response = await fetch(`${API_URL}/rooms/${matchId}/${roomId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось принять общение');
  }

  return await response.json();
};

export const declineGroupMatch = async (matchId, roomId, token) => {
  const response = await fetch(`${API_URL}/rooms/${matchId}/${roomId}/decline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не удалось отклонить общение');
  }

  return await response.json();
};
