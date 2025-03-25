import api from '@/utils/api';

export const loginUserApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login/user', { email, password });
    return {
      accessToken: response.data.accessToken, // Ritorna l'accessToken
      refreshToken: response.data.refreshToken, // Ritorna il refreshToken
      role: response.data.role,
      id: response.data.id,
      name: response.data.nameAndSurname,
    };
  } catch (error) {
    console.error('Errore di login', error);
    return null;
  }
};

export const loginPharmacyApi = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login/pharmacy', { email, password });
    return {
      accessToken: response.data.accessToken, // Ritorna l'accessToken
      refreshToken: response.data.refreshToken, // Ritorna il refreshToken
      id: response.data.id,
      name: response.data.nameCompany,
    };
  }
  catch (error) {
    console.error('Errore di login', error);
    return null;
  }
};

export const signupUserApi = async (user: {
  name: string,
  surname: string,
  fiscalCode: string,
  address: string,
  email: string,
  password: string,
  role: string,
  doctorId?: string,
}) => {
  try {
    const response = await api.post('/user', user);

    if (response.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Errore di signup', error);
    return null;
  }
}

export const signupPharmacyApi = async (pharmacy: {
  nameCompany: string,
  vatNumber: string,
  address: string,
  email: string,
  password: string,
}) => {
  try {
    const response = await api.post('/pharmacy', pharmacy);

    if (response.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Errore di signup', error);
    return null;
  }
}
