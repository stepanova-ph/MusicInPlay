import React, { useState } from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Player from "./Player/Player";
import swirlBlue from "../../assets/swirl-blue.jpg";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleDrawer = () => setIsOpen(!isOpen);

    return (
        <>
            <IconButton
                onClick={toggleDrawer}
                sx={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    zIndex: 10,
                    color: "white",
                }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={toggleDrawer}
                sx={{
                    "& .MuiDrawer-paper": {
                        overflow: "hidden",
                        backgroundImage: `url(${swirlBlue})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        padding: 2,
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            flex: "0 1 auto",
                            alignSelf: "stretch",
                        }}
                    >
                        <Player />
                    </Box>
                </Box>

            </Drawer>
        </>
    );
};

export default Sidebar;
