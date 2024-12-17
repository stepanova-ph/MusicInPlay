import React, { createContext, useState, useContext, useEffect } from "react";
import TRACKS from "../data/tracks";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [audioInstance, setAudioInstance] = useState(null);
    const [currentSong, setCurrentSong] = useState({
        ...TRACKS[0],
        progress: 0,
        duration: 0,
        playing: false,
    });

    useEffect(() => {
        if (audioInstance) {
            audioInstance.pause();
            const newAudio = new Audio(`/audio-files/${TRACKS[currentIndex].file}`);
            setAudioInstance(newAudio);

            setCurrentSong({
                ...TRACKS[currentIndex],
                progress: 0,
                duration: 0,
                playing: false,
            });

            newAudio.addEventListener("timeupdate", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    progress: newAudio.currentTime * 1000,
                }));
            });

            newAudio.addEventListener("loadedmetadata", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    duration: newAudio.duration * 1000,
                }));
            });

            newAudio.addEventListener("play", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    playing: true,
                }));
            });

            newAudio.addEventListener("pause", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    playing: false,
                }));
            });

            newAudio.play();
        }
    }, [currentIndex]);

    const initializeAudio = () => {
        if (!audioInstance) {
            const newAudio = new Audio(`/audio-files/${currentSong.file}`);
            setAudioInstance(newAudio);

            newAudio.addEventListener("timeupdate", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    progress: newAudio.currentTime * 1000,
                }));
            });

            newAudio.addEventListener("loadedmetadata", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    duration: newAudio.duration * 1000,
                }));
            });

            newAudio.addEventListener("play", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    playing: true,
                }));
            });

            newAudio.addEventListener("pause", () => {
                setCurrentSong((prev) => ({
                    ...prev,
                    playing: false,
                }));
            });
        }
    };

    const playAudio = () => {
        if (audioInstance) audioInstance.play();
    };

    const pauseAudio = () => {
        if (audioInstance) audioInstance.pause();
    };

    const playNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % TRACKS.length);
    };

    const playPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + TRACKS.length) % TRACKS.length);
    };

    const skip10Forward = () => {
        if (audioInstance) {
            audioInstance.currentTime = Math.min(
                audioInstance.currentTime + 10,
                audioInstance.duration
            );
        }
    };

    const skip10Back = () => {
        if (audioInstance) {
            audioInstance.currentTime = Math.min(
                audioInstance.currentTime - 10,
                audioInstance.duration
            );
        }
    };

    const toggleAudio = () => {
        if (audioInstance) {
            if (audioInstance.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        }
    }

    const getSampleRate = () => {
        if (audioInstance) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return audioContext.sampleRate;
        }
        return null;
    };
    

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                audioInstance,
                initializeAudio,
                playAudio,
                pauseAudio,
                playNext,
                playPrevious,
                setCurrentIndex,
                skip10Forward,
                skip10Back,
                toggleAudio,
                getSampleRate,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};
