import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#858FB4",
			light: "#A7B1D4",
			dark: "#57668c",
		},
		secondary: {
			main: "#EB7096",
			light: "#EBBAC2",
			dark: "##B55775",
		},
		background: {
			default: "#F5F2F0",
			paper: "#E3E0DE",
		},
		text: {
			primary: "#333333",
			secondary: "#616161",
		},
        warning: {
            main:'#9B2339',
        }
	},

	typography: {
		fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
		h1: {
			fontSize: "2.5rem",
			fontWeight: 700,
			color: "#191414",
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 600,
			color: "#191414",
		},
		body1: {
			fontSize: "1rem",
			color: "#4c4c4c",
		},
		body2: {
			fontSize: "0.875rem",
			color: "#4c4c4c",
		},
	},

	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "20px",
					textTransform: "none",
				},
				containedPrimary: {
					color: "#FFFFFF",
					backgroundColor: "#858FB4",
					"&:hover": {
						backgroundColor: "#57668c",
						color: "#FFFFFF",
					},
				},
				containedSecondary: {
					color: "#FFFFFF",
					backgroundColor: "#191414",
					"&:hover": {
						backgroundColor: "#4c4c4c",
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: "#F5F5F5",
					color: "#191414",
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#FFFFFF",
					color: "#191414",
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					backgroundColor: "#E0E0E0",
				},
			},
		},
		MuiBox: {
			styleOverrides: {
				root: {
					border: "1px solid #E0E0E0",
				},
			},
		},
	},
});

export default theme;
