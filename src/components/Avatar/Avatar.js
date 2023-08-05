import "./Avatar.css";

export const Avatar = ({ isMessageMine, avatarColor }) => {
  return (
    <div className="avatar" style={{ backgroundColor: isMessageMine ? "greenyellow" : avatarColor }} />
  )
}
