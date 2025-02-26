import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "PlanMate",
	description: "Atur jadwal tanpa ribet!",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "PlanMate",
		description: "Atur jadwal tanpa ribet!",
		creators: "Joan Orlando Purba",
		images:
			"https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png",
		url: "https://plan-mate-joan-punya.vercel.app/",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					property="og:image"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta
					property="og:image:type"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta
					property="og:image:width"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta
					property="og:image:height"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta property="og:image:alt" content="PlanMate" />

				<meta
					name="twitter:image"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta
					name="twitter:image:type"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta
					name="twitter:image:width"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta
					name="twitter:image:height"
					content="https://raw.githubusercontent.com/joanpurbaa/PlanMate/refs/heads/main/public/banner.png"
				/>
				<meta property="twitter:image:alt" content="PlanMate" />
			</head>
			<body className={`${poppins.className} antialiased bg-zinc-900`}>
				{children}
			</body>
		</html>
	);
}
