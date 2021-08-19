import Head from "next/head";
import React from "react";
import FavouriteTemplate from "src/templates/favourite";

export default function FavouritePage() {
	return (
		<>
			<Head>
				<title>Favourite - Eshop</title>
			</Head>
			<FavouriteTemplate />
		</>
	);
}
