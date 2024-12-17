import React, { useState, useEffect } from "react";
import { Box, Divider } from "@mui/material";
import CurrentSongCard from "./CurrentSongCard";
import SongQueue from "./SongQueue";
import TRACKS from "../../../data/tracks";

const Player = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [audio, setAudio] = useState(null);
    const [currentSong, setCurrentSong] = useState({
        ...TRACKS[currentIndex],
        playing: false,
        progress: 0,
        duration: 0,
    });

    useEffect(() => {
        const audioInstance = new Audio(`./data/audio_files/${TRACKS[currentIndex].file}`);
        setAudio(audioInstance);

        audioInstance.addEventListener("loadedmetadata", () => {
            setCurrentSong((prev) => ({
                ...prev,
                duration: audioInstance.duration * 1000,
            }));
        });

        audioInstance.addEventListener("timeupdate", () => {
            setCurrentSong((prev) => ({
                ...prev,
                progress: audioInstance.currentTime * 1000,
            }));
        });

        return () => {
            audioInstance.pause();
        };
    }, [currentIndex]);

    const playNext = () => {
        setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    };

    const playPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    };

    const pausePlayback = () => {
        audio.pause();
        setCurrentSong((prev) => ({ ...prev, playing: false }));
    };

    const resumePlayback = () => {
        audio.play();
        setCurrentSong((prev) => ({ ...prev, playing: true }));
    };

    const skipToSong = (index) => {
        setCurrentIndex(index);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
            }}
        >
            <CurrentSongCard
                currentSong={currentSong}
                playNext={playNext}
                playPrevious={playPrevious}
                pausePlayback={pausePlayback}
                resumePlayback={resumePlayback}
            />
            <Divider sx={{ width: "100%" }} />
            <SongQueue queue={TRACKS} playSong={skipToSong} />
        </Box>
    );
};

export default Player;
