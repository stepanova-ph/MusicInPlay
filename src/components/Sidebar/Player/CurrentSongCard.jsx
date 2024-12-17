import React from "react";
import { Box, Typography, LinearProgress, IconButton } from "@mui/material";
import DynamicTypography from "./DynamicTypography";
import PlayerControls from "./PlayerControls";
import { usePlayer } from "../../../context/PlayerContext";
import StarIcon from "@mui/icons-material/Star";

const CurrentSongCard = () => {
    const { currentSong, audioInstance } = usePlayer();

    const handleSkipToHighlight = () => {
        if (audioInstance && currentSong.highlight) {
            audioInstance.currentTime = currentSong.highlight / 1000;
        }
    };

    if (!currentSong) {
        return (
            <Typography variant="body1" sx={{ textAlign: "center", marginTop: 2 }}>
                No song currently playing
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "310px",
                marginBottom: 1,
                marginTop: 1,
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: 140,
                        height: 140,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            width: 140,
                            height: 140,
                            background: (theme) => theme.palette.primary.main,
                            borderRadius: "50%",
                            filter: "blur(25px)",
                            zIndex: 0,
                        }}
                    />
                    <Box
                        sx={{
                            width: 140,
                            height: 140,
                            backgroundImage: `url(${currentSong.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                            zIndex: 1,
                            overflow: "hidden",
                            "&:hover": {
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(${currentSong.img})`,
                            },
                        }}
                    />
                </Box>

                <Box sx={{ width: "100%", textAlign: "left" }}>
                    <DynamicTypography
                        text={currentSong.artists.join(", ")}
                        minFontSize={12}
                        maxFontSize={16}
                        containerWidth={310 - 120 - 12}
                        color="text.secondary"
                    />
                    <DynamicTypography
                        text={currentSong.title}
                        minFontSize={14}
                        maxFontSize={20}
                        containerWidth={310 - 120 - 12}
                        color="text.primary"
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            marginTop: 1,
                        }}
                    >
                        <PlayerControls />
                        {currentSong.highlight && (
                            <IconButton
                                size="small"
                                onClick={handleSkipToHighlight}
                                title="Skip to Highlight"
                            >
                                <StarIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Box>

            <Box sx={{ width: "100%", marginTop: 1 }}>
                <LinearProgress
                    variant="determinate"
                    value={(currentSong.progress / currentSong.duration) * 100 || 0}
                    sx={{ height: 6, borderRadius: 3 }}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.8rem",
                        marginTop: 0.5,
                    }}
                >
                    <Typography sx={{ fontSize: "10px" }}>
                        {new Date(currentSong.progress || 0).toISOString().substr(14, 5)}
                    </Typography>
                    <Typography sx={{ fontSize: "10px" }}>
                        {new Date(currentSong.duration || 0).toISOString().substr(14, 5)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CurrentSongCard;
