import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import logo from "./assets/logo.png";
import vite from "../public/vite.svg";
import shortLogo from "../src/assets/short-logo.png";
import { useNavigate } from "react-router-dom";
import { KeyboardArrowDown } from "@mui/icons-material";

const drawerWidth = 160;
const navItems = ["Search", "About", "Contact Us"];

function Navbar({ window, onLogout }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("Search");
  const [anchorEl, setAnchorEl] = React.useState(null); // State for dropdown menu

  React.useEffect(() => {
    // Map current path to nav items
    const pathToNavItem = {
      "/": "Search",
      "/favourites": "Favourites",
      "/about": "About",
      "/contact": "Contact Us",
      "/profile": "Profile",
      "/changePassword": "Change Password",
      "/restaurantDetail": "Restaurant Detail",
    };
    const currentPath = location.pathname;
    setActiveItem(pathToNavItem[currentPath] || "Search"); // Fallback to "Search"
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleNavClick = (item) => {
    if (item === "Search") {
      if (location.pathname === "/home" || location.pathname === "/") {
        // Scroll to the Search section
        const section = document.getElementById("search");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/", { replace: true });
        setTimeout(() => {
          const section = document.getElementById("search");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 300); // Delay to ensure the page transition completes
      }
    } else if (item === "About" || item === "Contact Us") {
      const sectionId = item.toLowerCase().replace(" ", "");
      if (location.pathname === "/home" || location.pathname === "/") {
        // Scroll directly if on the Search page
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/", { replace: true });
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 300); // Delay to allow navigation to complete
      }
    } else {
      const navToPath = {
        Profile: "/profile",
      };
      navigate(navToPath[item]);
    }
  };

  // const handleNavClick = (item) => {
  //   if (item === "Search") {
  //     if (location.pathname === "/home") {
  //       // Scroll to the top of the page if we are on /home
  //       const section = document.getElementById("search");
  //       if (section) {
  //         section.scrollIntoView({ behavior: "smooth" });
  //       }
  //     } else if (location.pathname === "/") {
  //       const section = document.getElementById("search");
  //       if (section) {
  //         section.scrollIntoView({ behavior: "smooth" });
  //       }
  //     } else {
  //       navigate("/", { replace: true }); // Navigate to the home page without full reload
  //     }
  //   } else if (item === "About" || item === "Contact Us") {
  //     const sectionId = item.toLowerCase().replace(" ", "");
  //     const section = document.getElementById(sectionId);
  //     if (section) {
  //       section.scrollIntoView({ behavior: "smooth" });
  //     }
  //   } else {
  //     const navToPath = {
  //       Profile: "/profile",
  //     };
  //     navigate(navToPath[item]);
  //   }
  // };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close menu when an option is selected
  };

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // 50% of a section must be visible to trigger
    };

    const observerCallback = (entries) => {
      let isTop = false;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const visibleSection = navItems.find(
            (item) => item.toLowerCase().replace(" ", "") === entry.target.id
          );
          if (visibleSection) {
            setActiveItem(visibleSection);
          }
        }
      });

      // Check if we're at the very top of the page, but only for routes other than /home
      if (window.scrollY === 0 && location.pathname !== "/home") {
        isTop = true;
        setActiveItem("Search");
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe the Search, About, and Contact Us sections
    navItems.forEach((item) => {
      if (item === "Search" || item === "About" || item === "Contact Us") {
        const sectionId = item.toLowerCase().replace(" ", "");
        const section = document.getElementById(sectionId);
        if (section) observer.observe(section);
      }
    });

    // Cleanup observer
    return () => {
      navItems.forEach((item) => {
        if (item === "Search" || item === "About" || item === "Contact Us") {
          const sectionId = item.toLowerCase().replace(" ", "");
          const section = document.getElementById(sectionId);
          if (section) observer.unobserve(section);
        }
      });
    };
  }, []);

  React.useEffect(() => {
    if (location.pathname === "/") {
      setActiveItem("Search");
    }
  }, [location.pathname]);

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          component="nav"
          sx={{
            background: "rgba(255, 255, 255, 0)", // Transparent background
            WebkitBackdropFilter: "blur(4px)", // Correct property for WebKit browsers
            backdropFilter: "blur(4px)", // Blur effect for supported browsers
            border: "1px solid rgba(255, 255, 255, 0)", // Transparent border
          }}
          className="appbar"
        >
          <Toolbar>
            <IconButton
              color="#050b20"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: "none" },
                outline: "none",
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <img src={shortLogo} alt="EatsNearYou" style={{ height: 40 }} />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  disableRipple
                  variant="navItem"
                  sx={{
                    color: "#050b20",
                    textDecoration: "none",
                    outline: "none",
                    position: "relative",
                    transition: "color 0.3s ease",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-6px",
                      left: "10%",
                      width: item === activeItem ? "80%" : "0%",
                      height: "2px",
                      backgroundColor: "#000",
                      transition: "width 0.3s ease",
                    },
                    "&:hover": {
                      color: "#000",
                      fontWeight: "500",
                    },
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                  onClick={() => handleNavClick(item)}
                >
                  {item}
                </Button>
              ))}
              <Button
                variant="navItem"
                disableRipple
                sx={{
                  color: "#000",
                  textAlign: "center",
                  textDecoration: "none",
                  "&:focus": {
                    outline: "none",
                  },
                }}
                onClick={handleMenuClick} // Open dropdown menu
              >
                <PersonOutlineOutlinedIcon />
                Account
                <KeyboardArrowDown />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={shortLogo} alt="EatsNearYou" style={{ height: 40 }} />
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item}
                  disableRipple
                  sx={{
                    color: "#050b20",
                    textDecoration: "none",
                    outline: "none",
                    position: "relative",
                    transition: "color 0.3s ease",
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "20%",
                      width: item === activeItem ? "60%" : "0%",
                      height: "2px",
                      backgroundColor: "#000",
                      transition: "width 0.3s ease",
                    },
                    "&:hover": {
                      color: "#000",
                      fontWeight: "500",
                    },
                  }}
                  onClick={() => {
                    handleNavClick(item);
                    setMobileOpen(false); // Close drawer when a nav item is selected
                  }}
                >
                  {item}
                </Button>
              ))}
              <Button
                disableRipple
                sx={{
                  color: "#000",
                  textAlign: "center",
                  textDecoration: "none",
                  "&:focus": {
                    outline: "none",
                  },
                }}
                onClick={handleMenuClick} // Open dropdown menu in Drawer
              >
                Account
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    setMobileOpen(false);
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setMobileOpen(false);
                    handleMenuClose();
                    navigate("/changePassword");
                  }}
                >
                  Change Password
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setMobileOpen(false);
                    handleMenuClose();
                    onLogout();
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}

export default Navbar;
