import { CardActionArea } from "@material-ui/core";
import React, { useCallback } from "react";
import styled, { keyframes } from "styled-components";
import CustomIconButton from "../customIconButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "src/store/slices/cartSlice";
import { IsInCartOrFavourite } from "src/utils/isInCartOrFavourite";
import {
	addToFavourite,
	removeFromFavourite,
} from "src/store/slices/favouriteSlice";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { useAuth } from "../authProvider";
import { useRouter } from "next/router";
import Image from "next/image";

interface pageProps {
	data;
	gridView?: string;
}

const mapState = (state) => ({
	loadingCartAdd: state.cart.add.loading,
	loadingCartRemove: state.cart.remove.loading,
	loadingFavouriteAdd: state.favourite.add.loading,
	loadingFavouriteRemove: state.favourite.remove.loading,
});

const ProductCard = ({ data, gridView }: pageProps) => {
	const { loading, isLogged } = useAuth();
	const {
		loadingCartAdd,
		loadingCartRemove,
		loadingFavouriteAdd,
		loadingFavouriteRemove,
	} = useSelector(mapState);
	const { title, price, category, brand, images, _id } = data;
	const dispatch = useDispatch();
	const { isInCart, isInFavourite } = IsInCartOrFavourite({ id: data._id });
	const router = useRouter();

	const handleAddToCart = useCallback(async () => {
		if (isLogged) {
			if (isInCart) {
				return dispatch(removeFromCart({ product: data }));
			}
			if (!isInCart) {
				return dispatch(addToCart({ productId: _id, qty: 1 }));
			}
		}

		router.push(`/sign-in?redirect=${router.pathname}`);

		return;
	}, [data, dispatch, isInCart, _id, isLogged, router]);

	const handleAddToFavourite = useCallback(() => {
		if (isLogged) {
			if (isInFavourite) {
				return dispatch(removeFromFavourite({ product: data }));
			}
			if (!isInFavourite) {
				return dispatch(addToFavourite({ productId: data._id }));
			}
		}

		router.push(`/sign-in?redirect=${router.pathname}`);

		return;
	}, [dispatch, isInFavourite, data, isLogged, router]);

	return (
		<Card component="div">
			<Link passHref href={`/product/${_id}`}>
				<ImageWrapper gridwiew={gridView}>
					<a href={`/product/${_id}`}>
						<Image
							draggable={false}
							src={images[0]}
							alt={title}
							layout="fill"
							objectFit="cover"
						/>
					</a>
				</ImageWrapper>
			</Link>
			<Body>
				<Content>
					<Link passHref href={`/product/${_id}`}>
						<a href={`/product/${_id}`}>
							<Title>{title}</Title>
						</a>
					</Link>
					<ContentRow>
						<span>{`${brand}`}</span>
						{/* <span>{`${brand} / ${category}`}</span> */}
					</ContentRow>
					<Price>${price.$numberDecimal ?? price}</Price>
				</Content>
				<Actions>
					<CustomIconButton
						onClick={handleAddToFavourite}
						ariaLabel={
							isInFavourite
								? "Remove product from favourite list"
								: "Add product to favourite list"
						}
						size="medium"
						Icon={isInFavourite ? FavoriteIcon : FavoriteBorderIcon}
						active={isInFavourite}
						loading={loadingFavouriteAdd || loadingFavouriteRemove || loading}
					/>
					<CustomIconButton
						onClick={handleAddToCart}
						ariaLabel={
							isInCart ? "Remove product from cart" : "Add product to cart"
						}
						size="medium"
						Icon={isInCart ? RemoveShoppingCartIcon : AddShoppingCartIcon}
						active={isInCart}
						loading={loadingCartAdd || loadingCartRemove || loading}
					/>
				</Actions>
			</Body>
		</Card>
	);
};

export default ProductCard;

const productAppear = keyframes`
	from{
		opacity: 0;
		transform: scale(0.96);
	}
	to {
		opacity: 1;
		transform: none;
	}
`;

const Card = styled(CardActionArea)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	background: ${({ theme }) => theme.surface.secondary};
	border-radius: 2px;
	overflow: hidden;
	animation: ${productAppear} 0.3s linear;
	cursor: default;

	> span {
		background: transparent;
		color: ${({ theme }) => theme.color.white};
	}
`;

const ImageWrapper = styled.div`
	position: relative;
	display: flex;
	overflow: hidden;
	height: ${({ gridwiew }) =>
		gridwiew === "fit" ? "325px" : "clamp(100px, 60vw, 350px)"};
	cursor: pointer;
	width: 100%;
	transition: height 0.15s ease-in-out;

	img {
		transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1);
	}

	@media (min-width: 768px) {
		${Card}:hover & {
			img {
				transform: scale(1.1);
			}
		}
	}
`;

const Body = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-grow: 1;
	width: 100%;
`;

const Content = styled.div`
	display: grid;
	grid-template-areas: "title title" "category price";
	grid-template-columns: 2fr 1fr;
	gap: 7px;
	padding: 10px 5px 0px 5px;
	color: ${({ theme }) => theme.color.white};
`;

const Title = styled.div`
	grid-area: title;
	color: ${({ theme }) => theme.color.white};
	align-self: flex-start;
	font-size: calc(15px + 0.1vw);
	cursor: pointer;
	transition: color 0.15s ease-in-out;
	line-height: 1.2;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;

	&:hover,
	&:focus {
		color: ${({ theme }) => theme.color.primary};
	}
`;

const ContentRow = styled.div`
	grid-area: category;
	opacity: 0.65;
	font-size: calc(14px + 0.05vw);
	text-transform: capitalize;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
`;

const Price = styled.div`
	grid-area: price;
	justify-self: end;
	font-size: calc(15px + 0.1vw);
`;

const Actions = styled.div`
	display: flex;
	place-content: center space-between;
	padding: 7px 5px 10px 5px;
`;