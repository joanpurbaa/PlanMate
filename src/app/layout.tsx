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
		images: "./banner.png",
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
				<meta property="og:image" content="<generated>" />
				<meta property="og:image:type" content="<generated>" />
				<meta property="og:image:width" content="<generated>" />
				<meta property="og:image:height" content="<generated>" />
				<meta property="og:image:alt" content="PlanMate" />

				<meta name="twitter:image" content="<generated>" />
				<meta name="twitter:image:type" content="<generated>" />
				<meta name="twitter:image:width" content="<generated>" />
				<meta name="twitter:image:height" content="<generated>" />
				<meta property="twitter:image:alt" content="PlanMate" />
			</head>
			<body className={`${poppins.className} antialiased bg-zinc-900`}>
				{children}
			</body>
		</html>
	);
}
