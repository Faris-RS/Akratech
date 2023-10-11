import axios from "axios";
import { URL } from "./env";

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
  const response = await axios.get(`${URL}?results=${count}`);
  return response.data.results;
};

export default getRandomUsers;
