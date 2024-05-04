"use client";

import { Box } from "@mui/material";

interface SandboxLayoutContentProps {
  main: any;
  topRight: any;
  bottomRight: any;
}

const SandboxLayout = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
}: SandboxLayoutContentProps) => {
  const drawerWidth = 50;
  const headerHeight = 50;
  const editorWidth = 450;

  const mainStyle = {
    position: "fixed",
    top: "0",
    bottom: "0",
    bgcolor: "yellow",
    width: {
      xs: "0",
      sm: "0",
      md: `calc(100% - ${drawerWidth}px)`,
      lg: `calc(100% - ${drawerWidth}px - ${editorWidth}px)`,
      xl: `calc(100% - ${drawerWidth}px - ${editorWidth}px)`,
    },
    maxWidth: {
      xs: "0",
      sm: "0",
      md: `calc(100% - ${drawerWidth}px)`,
      lg: `calc(100% - ${drawerWidth}px - ${editorWidth}px)`,
      xl: `calc(100% - ${drawerWidth}px - ${editorWidth}px)`,
    },
    ml: {
      xs: 0,
      sm: 0,
      md: `${drawerWidth}px`,
      lg: `${drawerWidth}px`,
      xl: `${drawerWidth}px`,
    },
    mr: {
      xs: 0,
      md: 0,
      lg: `${editorWidth}px`,
      xl: `${editorWidth}px`,
    },
    overflow: "scroll",
    mt: `${headerHeight}px`,
  };

  const topRightStyle = {
    position: "fixed",
    top: `${headerHeight}px`,
    right: 0,
    height: `calc((100% - ${headerHeight}px)/2)`,
    width: `${editorWidth}px`,
    maxWidth: `${editorWidth}px`,
    bgcolor: "black",
    overflow: "scroll",
  };

  const bottomRightStyle = {
    position: "fixed",
    right: 0,
    bottom: 0,
    height: `calc((100% - ${headerHeight}px)/2)`,
    width: `${editorWidth}px`,
    maxWidth: `${editorWidth}px`,
    bgcolor: "red",
    overflow: "scroll",
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box id="main-content" sx={mainStyle}>
        <Main />
      </Box>
      <Box id="topRight-content" sx={topRightStyle}>
        <TopRight />
      </Box>
      <Box id="bottomRight-content" sx={bottomRightStyle}>
        <BottomRight />
      </Box>
    </Box>
  );
};

export default SandboxLayout;
