import { FIRST_NAME, LAST_NAME } from "../constants/names";

export const randomName = () => {
  const randomFirstName = FIRST_NAME[Math.floor(Math.random() * FIRST_NAME.length)];
  const randomLastName = LAST_NAME[Math.floor(Math.random() * LAST_NAME.length)];
  return randomFirstName + " " + randomLastName;
}