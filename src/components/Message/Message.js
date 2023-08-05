import { Avatar } from "../Avatar/Avatar"
import "./Message.css"

export const Message = ({ children, fullName, isMessageMine, avatarColor, datePublished }) => {
  const classNameContainer = "message-container " + (isMessageMine ? "message-container--active" : "");
  const classNameOwner = "message__owner " + (isMessageMine ? "message__owner--active" : "");
  const classNameMessage = "message " + (isMessageMine ? "message--active" : "");
  const classNameTime = "message__time " + (isMessageMine ? "message__time--active" : "");
  const timePublished = new Date(datePublished).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={classNameContainer}>
      <div className="message-container__content">
        <p className={classNameOwner}>{fullName}</p>
        <p className={classNameMessage}>{children}</p>
        <span className={classNameTime}>{timePublished}</span>
      </div>
      <Avatar isMessageMine={isMessageMine} avatarColor={avatarColor} />
    </div>
  )
}
