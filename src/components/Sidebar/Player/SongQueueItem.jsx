import React from "react";
import { Box, Typography } from "@mui/material";

const SongQueueItem = ({ title, artist, imageUrl, onClick }) => {
	return (
		<Box
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "center",
				marginBottom: 2,
				padding: 1,
				borderRadius: "8px",
				width: "100%",
				position: "relative",
				backgroundColor: (theme) => `${theme.palette.primary.main}10`,
				overflow: "hidden",
				cursor: "pointer",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: (theme) => theme.palette.primary.main,
					filter: "blur(15px)",
					opacity: 0.55,
					borderRadius: "inherit",
					zIndex: -1,
					transition: "filter 0.3s ease, opacity 0.3s ease",
				},
				"&:hover::before": {
					filter: "blur(10px)",
					opacity: 0.75,
				},
			}}
		>
			<Box
				sx={{
					width: 80,
					height: 80,
					backgroundImage: `url(${imageUrl})`,
					backgroundColor: "#ddd",
					backgroundSize: "cover",
					backgroundPosition: "center",
					marginRight: 2,
					flexShrink: 0,
					zIndex: 1,
				}}
			/>

			<Box
				sx={{
					overflow: "hidden",
					flex: 1,
					minWidth: 0,
					zIndex: 1,
				}}
			>
				<Typography
					noWrap
					variant="body1"
					sx={{
						textOverflow: "ellipsis",
						overflow: "hidden",
						whiteSpace: "nowrap",
						fontSize: 18,
					}}
				>
					{title}
				</Typography>
				<Typography
					noWrap
					variant="body2"
					color="textSecondary"
					sx={{
						textOverflow: "ellipsis",
						overflow: "hidden",
						whiteSpace: "nowrap",
					}}
				>
					{artist}
				</Typography>
			</Box>
		</Box>
	);
};

export default SongQueueItem;
