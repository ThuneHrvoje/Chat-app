import "./Input.css";

export const Input = ({ name, value, onChange }) => {
  return <input name={name} value={value} onChange={onChange} className="input" placeholder="Write a message" autoComplete="off" />;
};
