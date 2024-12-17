import React, { useEffect, useRef, useMemo } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { usePlayer } from "../context/PlayerContext";
import "p5/lib/addons/p5.sound";
import VISUALS from "../data/visuals";

const AudioCanvas = () => {
    const { currentSong, audioInstance, skip10Forward, skip10Back, getSampleRate } = usePlayer();
    const fftRef = useRef(null);
    const mediaElementSourceRef = useRef(null);
    const lastAudioInstanceRef = useRef(null);
    const drawContextRef = useRef(null);
    const progressRef = useRef(0);

    useEffect(() => {
        progressRef.current = currentSong.progress || 0;
    }, [currentSong.progress]);


    useEffect(() => {
        if (audioInstance) {
            if (audioInstance.paused) {
                window.p5Instance?.noLoop();
            } else {
                window.p5Instance?.loop();
            }
        }
    }, [audioInstance?.paused]);

    const handleKeyPress = (event) => {
        if (event.key === "ArrowLeft") {
            skip10Back();
        } else if (event.key === "ArrowRight") {
            skip10Forward();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [audioInstance]);

    const sketch = useMemo(() => {
        return (p) => {
            let visualContext = VISUALS[currentSong.id];
            let previousValues = [];
            let spectrumSize = 512;
    
            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                fftRef.current = new p5.FFT(0.8, spectrumSize);
                window.p5Instance = p
    
                previousValues = Array(spectrumSize).fill(0);
    
                if (audioInstance) {
                    const audioContext = p5.prototype.getAudioContext();
                    audioContext.resume();
    
                    if (lastAudioInstanceRef.current !== audioInstance) {
                        if (mediaElementSourceRef.current) {
                            mediaElementSourceRef.current.disconnect();
                        }
    
                        mediaElementSourceRef.current = audioContext.createMediaElementSource(audioInstance);
                        mediaElementSourceRef.current.connect(audioContext.destination);
                        mediaElementSourceRef.current.connect(fftRef.current.analyser);
                        fftRef.current.setInput(mediaElementSourceRef.current);
    
                        lastAudioInstanceRef.current = audioInstance;
                    }
                }
    
                if (visualContext?.setup) {
                    drawContextRef.current = visualContext.setup(p, { fft: fftRef.current, palette: currentSong.palette });
                }
            };
    
            p.draw = () => {
                if (audioInstance.duration === audioInstance.progress) {
                    p.background(currentSong.palette.background);
                    return;
                }
    
                const spectrum = fftRef.current.analyze();
                const smoothedSpectrum = spectrum.map((value, index) => {
                    previousValues[index] = Math.max(value, previousValues[index] * 0.9);
                    return previousValues[index];
                });
    
                const sampleRate = getSampleRate();
                const octaveBands = fftRef.current.getOctaveBands(3, 15.625).map((band) => {
                    const { lo, hi } = band;
                    const loIndex = Math.floor(p.map(lo, 0, sampleRate / 2, 0, spectrumSize));
                    const hiIndex = Math.floor(p.map(hi, 0, sampleRate / 2, 0, spectrumSize));
    
                    const energy = smoothedSpectrum
                        .slice(loIndex, hiIndex + 1)
                        .reduce((sum, val) => sum + val, 0) / (hiIndex - loIndex + 1);
    
                    return { ...band, energy };
                });
    
                const fftData = {
                    energies: {
                        bass: fftRef.current.getEnergy("bass"),
                        lowMid: fftRef.current.getEnergy("lowMid"),
                        mid: fftRef.current.getEnergy("mid"),
                        highMid: fftRef.current.getEnergy("highMid"),
                        treble: fftRef.current.getEnergy("treble"),
                    },
                    centroid: fftRef.current.getCentroid(),
                    octaveBands,
                    sampleRate,
                };
    
                if (visualContext?.draw) {
                    visualContext.draw(p, { 
                        fft: fftData, 
                        palette: currentSong.palette, 
                        drawContext: drawContextRef.current, 
                        progress: progressRef.current
                    });
                } else {
                    p.background(0);
                }
            };
    
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };
    }, [currentSong.id]);
    

    useEffect(() => {
        if (audioInstance) {
            const audioContext = p5.prototype.getAudioContext();

            audioContext.resume();

            if (lastAudioInstanceRef.current !== audioInstance) {
                if (mediaElementSourceRef.current) {
                    mediaElementSourceRef.current.disconnect();
                }

                mediaElementSourceRef.current = audioContext.createMediaElementSource(audioInstance);
                mediaElementSourceRef.current.connect(audioContext.destination);
                mediaElementSourceRef.current.connect(fftRef.current.analyser);
                fftRef.current.setInput(mediaElementSourceRef.current);

                lastAudioInstanceRef.current = audioInstance;
            }
        }
    }, [audioInstance]);

    return <ReactP5Wrapper sketch={sketch} />;
};

export default AudioCanvas;
