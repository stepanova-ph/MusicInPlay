import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import SongQueueItem from "./SongQueueItem";
import SimpleBar from "simplebar-react"; // Import SimpleBar
import "simplebar-react/dist/simplebar.min.css";
import { usePlayer } from "../../../context/PlayerContext";
import TRACKS from "../../../data/tracks";

const SongQueue = () => {
    const { currentSong, playAudio, setCurrentIndex } = usePlayer();

    const queue = useMemo(() => {
        if (!currentSong) return [];
        const currentIndex = TRACKS.findIndex((track) => track.id === currentSong.id);
        const rotatedQueue = [
            ...TRACKS.slice(currentIndex + 1),
            ...TRACKS.slice(0, currentIndex),
        ];
        return rotatedQueue;
    }, [currentSong]);

    const handleSongClick = (index) => {
        const songIndex = TRACKS.findIndex((track) => track.id === queue[index].id);
        setCurrentIndex(songIndex);
        playAudio();
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                height: "100%",
            }}
        >
            <Typography
                variant="body2"
                sx={{ textAlign: "center", marginBottom: 2, marginTop: 2 }}
            >
                UP NEXT
            </Typography>
            <Box
                sx={{
                    flex: 1,
                    overflow: "hidden",
                }}
            >
                    {queue.map((song, index) => (
                        <SongQueueItem
                            key={song.id} // Ensure unique key
                            title={song.title}
                            artist={song.artists.join(", ")}
                            imageUrl={song.img}
                            onClick={() => handleSongClick(index)}
                        />
                    ))}
            </Box>
        </Box>
    );
};

export default SongQueue;
