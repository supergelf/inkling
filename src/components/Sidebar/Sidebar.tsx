import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useSidebar } from "../../utils/SideBarContext";

function Sidebar() {
  const { isSidebarOpen } = useSidebar();

  return (
    <nav className={`sidebar_root ${isSidebarOpen ? "open" : "closed"}`}>
      <section className="sidebar_top">
        <section className="sidebar_search">
          <img src="/icons/search.svg" />
          <input type="text" placeholder="Search" />
        </section>

        <NavLink to={"/"}>
          <img src="/icons/home.svg" />
          Home
        </NavLink>
      </section>

      <section className="sidebar_main">
        <section className="sidebar_main_top">
          <p>Stuff</p>
          <img src="/icons/plus.svg" />
        </section>

        <NavLink to={"/notes"}>
          <img src="/icons/doc.svg" />
          Notes
        </NavLink>
        <NavLink to={"/tasks"}>
          <img src="/icons/checklist.svg" />
          Tasks
        </NavLink>

        <NavLink to={"/calendar"}>
          <img src="/icons/calendar.svg" />
          Calendar
        </NavLink>
      </section>

      <section className="sidebar_bottom">
        <NavLink to={"/settings"}>
          <img src="/icons/settings.svg" />
          Settings
        </NavLink>
      </section>
    </nav>
  );
}

export default Sidebar;
