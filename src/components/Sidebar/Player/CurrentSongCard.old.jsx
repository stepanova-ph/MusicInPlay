import React from "react";
import { Box, Typography, IconButton, LinearProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

const CurrentSongCard = ({ currentSong, playNext, playPrevious, pausePlayback, resumePlayback}) => {

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
				width: "100%",
				maxWidth: 400,
				padding: 2,
				marginBottom: 2,
			}}
		>
			<Box
				sx={{
					position: "relative",
					width: 200,
					height: 200,
					marginBottom: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						width: 220,
						height: 220,
						background: (theme) => theme.palette.primary.main,
						borderRadius: "50%",
						filter: "blur(30px)",
						zIndex: 0,
					}}
				/>

				<Box
					sx={{
						width: 200,
						height: 200,
						borderRadius: 1,
						backgroundImage: `url(${currentSong.img.url})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						position: "relative",
						zIndex: 1,
						overflow: "hidden"
					}}
				/>
			</Box>



			<Typography variant="h6">{currentSong.name}</Typography>
			<Typography variant="body2" color="textSecondary">
				{currentSong.artist}
			</Typography>

			<Box sx={{ width: "100%", marginY: 1 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
					<Typography>{new Date(currentSong.progress).toISOString().substr(14, 5)}</Typography>
					<Typography>{new Date(currentSong.duration).toISOString().substr(14, 5)}</Typography>
				</Box>
				<LinearProgress
					variant="determinate"
					value={(currentSong.progress / currentSong.duration) * 100}
				/>
			</Box>

			<Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
				<IconButton onClick={playPrevious}>
					<SkipPreviousIcon sx={{color: (theme) => theme.palette.text.primary}}/>
				</IconButton>
				
				{(currentSong.playing ? 
					<IconButton onClick={pausePlayback}>
						<PauseIcon sx={{color: (theme) => theme.palette.text.primary}}/>
					</IconButton>
					:				
					<IconButton onClick={resumePlayback}>
						<PlayArrowIcon sx={{color: (theme) => theme.palette.text.primary}}/>
					</IconButton>
				)}

				<IconButton onClick={playNext}>
					<SkipNextIcon sx={{color: (theme) => theme.palette.text.primary}}/>
				</IconButton>
			</Box>
		</Box>
	);
};

export default CurrentSongCard;
