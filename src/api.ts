import axios from 'axios';

interface User {
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
  picture: {
    thumbnail: string;
  };
}

const getRandomUsers = async (count: number): Promise<User[]> => {
  const response = await axios.get(`https://randomuser.me/api/?results=${count}`);
  return response.data.results;
};

export default getRandomUsers;
