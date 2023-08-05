import { useEffect, useMemo, useState } from "react";
import { ROOM_NAME } from "./constants/room";
import { Avatar, Input, Layout, Message } from "./components";
import "./App.css";

import { randomColor, randomName } from "./utility";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState({ allMembers: [], onlineMembers: [] });
  const [isDroneSet, setIsDroneSet] = useState(false);
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);
  const [isConnectedToRoom, setIsConnectedToRoom] = useState(false);
  const drone = useMemo(() => {
    setIsDroneSet(true);
    return new window.Scaledrone(process.env.REACT_APP_SCALEDRONE_CHANNEL_ID);
  }, []);

  useEffect(() => {
    if (!isDroneSet && isConnectionEstablished) {
      return;
    }

    drone.on("open", (error) => {
      if (error) {
        setIsConnectionEstablished(false);
        return console.error("Connection to channel has failed.", error);
      } else {
        setIsConnectionEstablished(true);
      }
    });
  }, [drone, isConnectionEstablished, isDroneSet])


  useEffect(() => {
    if (!isConnectionEstablished) {
      return;
    }

    const room = drone.subscribe(ROOM_NAME);

    if (!isConnectedToRoom) {
      room.on("open", error => {
        if (error) {
          setIsConnectedToRoom(false);
          return console.error("Subscription to room has failed", error);
        } else {
          setIsConnectedToRoom(true);
        }
      });
    }

    if (!isConnectedToRoom) {
      return;
    }

    room.on("message", (message) => setMessages((current) => [...current, message]));
  }, [drone, isConnectedToRoom, isConnectionEstablished]);

  useEffect(() => {
    if (!isConnectionEstablished) {
      return;
    }


    const roomObservable = drone.subscribe(`observable-${ROOM_NAME}`);
    roomObservable.on("members", (members) => {
      const membersExtended = members.map((member) => ({
        id: member.id,
        color: randomColor(),
        fullName: randomName(),
      }));
      setMembers({ allMembers: membersExtended, onlineMembers: membersExtended });
    });

    roomObservable.on("member_leave", (member) => {
      setMembers((current) => {
        return {
          allMembers: current.allMembers,
          onlineMembers: current.onlineMembers.filter((currMember) => currMember.id !== member.id),
        }
      });
    });

    roomObservable.on("member_join", (member) => {
      const newMember = { id: member.id, color: randomColor(), fullName: randomName() };
      setMembers((current) => {
        return {
          allMembers: [...current.allMembers, newMember],
          onlineMembers: [...current.onlineMembers, newMember]
        }
      });
    });
  }, [drone, isConnectionEstablished])


  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formObjectData = Object.fromEntries(formData);

    if (formObjectData.message.length > 0) {
      drone.publish({
        room: ROOM_NAME,
        message: { message: formObjectData.message },
      });
      event.target.reset();
    }
  };

  return (
    <Layout>
      <Layout.Wrapper>
        <Layout.Content>
          {messages.map((item) => {
            const isMessageMine = item.clientId === drone.clientId;
            const messageOwner = members.allMembers.find((member) => member.id === item.clientId);
            const datePublished = new Date(item.timestamp * 1000);
            return (
              <Message key={item.id} fullName={messageOwner.fullName} isMessageMine={isMessageMine} avatarColor={messageOwner.color} datePublished={datePublished}>
                {item.data.message}
              </Message>
            );
          })}
        </Layout.Content>

        <form onSubmit={handleSubmit} className="form">
          <Input name="message" />
          <button type="submit" className="form__button">
            Send
          </button>
        </form>
      </Layout.Wrapper>


      <Layout.Sidebar>
        <h3 className="sidebar-title">Number of active members: {members.onlineMembers.length}</h3>

        <div className="members">
          {members.onlineMembers.map(member => {
            const isMe = member.id === drone.clientId;

            return (
              <div key={member.id} className="members__item">
                <Avatar isMessageMine={isMe} avatarColor={member.color} />
                <span>{member.fullName} {isMe && "(You)"}</span>
              </div>
            )
          })}
        </div>
      </Layout.Sidebar>
    </Layout>
  );
};

export default App;
