import { useEffect, useState } from "react";
import "./TitleBar.css";
import { useSidebar } from "../../utils/SideBarContext";

const { ipcRenderer } = window.electron;

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { toggleSidebar, isSidebarOpen } = useSidebar();

  const handleMinimize = () => {
    ipcRenderer.send("minimize-window");
  };

  const handleMaximizeToggle = () => {
    if (isMaximized) {
      window.electron.ipcRenderer.send("unmaximize-window");
    } else {
      window.electron.ipcRenderer.send("maximize-window");
    }
  };

  const handleClose = () => {
    ipcRenderer.send("close-window");
  };

  // Listen for maximize/unmaximize events from the main process
  useEffect(() => {
    window.electron.ipcRenderer.on("window-maximized", () => setIsMaximized(true));
    window.electron.ipcRenderer.on("window-unmaximized", () => setIsMaximized(false));

    return () => {
      window.electron.ipcRenderer.off("window-maximized", () => setIsMaximized(true));
      window.electron.ipcRenderer.off("window-unmaximized", () => setIsMaximized(false));
    };
  }, []);

  return (
    <section className="titlebar_root" style={{ WebkitAppRegion: "drag" } as any}>
      <svg role="graphics-symbol" viewBox="0 0 20 20" className="tiltebar_icon">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.00992 2.5822C7.37564 1.60345 5.34973 1.8529 4.00205 3.05811C3.69329 3.33423 3.66683 3.80837 3.94295 4.11712C4.21906 4.42588 4.6932 4.45234 5.00196 4.17622C5.874 3.39637 7.18434 3.23731 8.23923 3.86907C8.49682 4.02334 8.71888 4.21224 8.90393 4.42579C9.17518 4.73883 9.64885 4.7727 9.96188 4.50144C10.2749 4.23018 10.3088 3.75652 10.0375 3.44348C9.7497 3.11132 9.40554 2.81913 9.00992 2.5822ZM10.5773 5.23958C11.7812 3.22935 14.3868 2.57569 16.397 3.77958C17.031 4.15924 17.5315 4.6799 17.8804 5.27786C18.0892 5.6356 17.9685 6.09487 17.6107 6.30365C17.253 6.51244 16.7937 6.39169 16.5849 6.03394C16.3601 5.64878 16.038 5.31297 15.6264 5.06646C14.3268 4.2882 12.6425 4.71076 11.8642 6.01027L6.20294 15.4633L10.5234 16.1636C10.9322 16.2299 11.21 16.615 11.1437 17.0239C11.0774 17.4328 10.6922 17.7105 10.2834 17.6443L4.87132 16.767C4.62587 16.7272 4.41609 16.5684 4.31125 16.3429C4.2064 16.1175 4.22013 15.8547 4.34788 15.6414L10.5773 5.23958ZM14.4038 8.94146C14.2934 9.6229 13.6514 10.0858 12.97 9.97532C12.2885 9.86487 11.8257 9.22291 11.9361 8.54147C12.0466 7.86003 12.6885 7.39716 13.37 7.50761C14.0514 7.61806 14.5143 8.26002 14.4038 8.94146ZM7.81488 7.87364C7.70443 8.5551 7.06245 9.01799 6.38099 8.90754C5.69953 8.79708 5.23663 8.15511 5.34709 7.47364C5.45755 6.79218 6.09952 6.32929 6.78099 6.43975C7.46245 6.5502 7.92534 7.19218 7.81488 7.87364Z"
        ></path>
      </svg>

      <button className={`titlebar_close ${isSidebarOpen ? "open" : "closed"}`} onClick={toggleSidebar}>
        <img src={isSidebarOpen ? `/icons/sidebar_collapse.svg` : `/icons/sidebar_expand.svg`} />
      </button>
      <section className="window_controls">
        <button onClick={handleMinimize}>
          <img src="/icons/minimize.svg" />
        </button>

        <button onClick={handleMaximizeToggle}>
          {isMaximized ? <img src="/icons/restore.svg" /> : <img src="/icons/maximize.svg" />}
        </button>

        <button onClick={handleClose}>
          <img src="/icons/close.svg" />
        </button>
      </section>
    </section>
  );
};

export default TitleBar;
