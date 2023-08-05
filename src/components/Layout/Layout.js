import { useEffect } from "react";
import "./Layout.css";

export const Layout = ({ children }) => {
  return (
    <main className="container">
      <div className="container__content">
        {children}
      </div>
    </main>
  )
}

const LayoutWrapper = ({ children }) => {
  return (
    <div className="wrapper">
      {children}
    </div>
  )
}

Layout.Wrapper = LayoutWrapper;

const LayoutContent = ({ children }) => {
  useEffect(() => {
    const objDiv = document.getElementById("messages");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight
    }
  }, [children])

  return (
    <div className="content" id="messages">
      {children}
    </div>
  )
}

Layout.Content = LayoutContent;

const LayoutSidebar = ({ children }) => {
  return (
    <aside className="sidebar">
      {children}
    </aside>
  )
}

Layout.Sidebar = LayoutSidebar;
