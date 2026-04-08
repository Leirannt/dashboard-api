import axios from "axios";

export const fetchUsers = async () => {
  const res = await axios.get("https://dummyjson.com/users");
  return res.data.users;
};