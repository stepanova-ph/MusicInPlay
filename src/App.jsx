import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import { Dialog, DialogActions, DialogContent, Button, Typography } from "@mui/material";
import AudioCanvas from "./components/AudioCanvas";

const AppContent = () => {
    const [initialized, setInitialized] = useState(false);
    const { initializeAudio } = usePlayer();

    const handleStart = () => {
        initializeAudio();
        setInitialized(true);
    };

    return (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            {!initialized ? (
                <Dialog open={!initialized} disableEscapeKeyDown>
                    <DialogContent>
                        <Typography variant="h6" align="center">
                            Click the button to start the application
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleStart}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Start
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <>
                    <AudioCanvas
                        style={{
                            position: "absolute",
                            zIndex: -1,
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        }}
                    />
                    <Sidebar />
                </>
            )}
        </div>
    );
};

const App = () => {
    return (
        <PlayerProvider>
            <AppContent />
        </PlayerProvider>
    );
};

export default App;
