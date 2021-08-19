import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ProductDetailsTemplate from "src/templates/productDetails";
import { fetcher } from "src/utils/swrFetcher";
import useSWR from "swr";

export default function ProductPage() {
	const {
		query: { id },
	} = useRouter();
	const { data, error } = useSWR(id && `/api/products/${id}`, fetcher);

	return (
		<>
			<Head>
				<title>{!data ? "Product" : `${data?.data.title}`} - Eshop</title>
			</Head>
			<ProductDetailsTemplate productData={data?.data} productError={error} />
		</>
	);
}
