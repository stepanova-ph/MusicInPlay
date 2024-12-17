import React from "react";
import { IconButton } from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { usePlayer } from "../../../context/PlayerContext";

const PlayerControls = () => {
    const { playPrevious, playAudio, pauseAudio, playNext, currentSong } = usePlayer();

    return (
        <>
            <IconButton size="small" onClick={playPrevious}>
                <SkipPreviousIcon />
            </IconButton>
            {currentSong.playing ? (
                <IconButton size="small" onClick={pauseAudio}>
                    <PauseIcon />
                </IconButton>
            ) : (
                <IconButton size="small" onClick={playAudio}>
                    <PlayArrowIcon />
                </IconButton>
            )}
            <IconButton size="small" onClick={playNext}>
                <SkipNextIcon />
            </IconButton>
        </>
    );
};

export default PlayerControls;
