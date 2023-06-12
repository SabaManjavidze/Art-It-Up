import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useState } from "react";
import { api } from "../utils/api";
import { toBase64 } from "../utils/convertToBase64";
import { v2 as cloudinary } from "cloudinary";

type EntityContextProps = {
	isOpen: boolean;
	galleryUploadLoading: boolean;
	// setIsOpen: Dispatch<SetStateAction<boolean>>;
	name: string;
	setName: Dispatch<string>;
	entityImg: File[];
	setEntityImg: Dispatch<SetStateAction<File[]>>;
	handleAddEntityClick: () => void;
	handleCreateEntitySubmit: () => void;
	handleCancelEntityClick: () => void;
	handleImageUpload: (imgs: File[]) => Promise<void>;
	closeModal: () => void;
	showGalleryUpload: boolean;
};
export const EntityContext = createContext<EntityContextProps>({
	isOpen: false,
	galleryUploadLoading: false,
	showGalleryUpload: false,
	// setIsOpen: () => {},
	name: "",
	setName: () => { },
	entityImg: [],
	setEntityImg: () => { },
	handleAddEntityClick: () => { },
	handleCancelEntityClick: () => { },
	handleCreateEntitySubmit: () => { },
	handleImageUpload: async (imgs) => { },
	closeModal: () => { },
});
export const useEntities = () => useContext(EntityContext);

const MAX_IMG_COUNT = 40;
const MIN_IMG_COUNT = 1;

export const EntityProvider = ({ children }: { children: ReactNode }) => {
	const [entityImg, setEntityImg] = useState<File[]>([]);
	const [showGalleryUpload, setShowGalleryUpload] = useState(false);
	const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);
	const [name, setName] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	const { mutateAsync: createEntity } = api.entity.createEntity.useMutation();
	const utils = api.useContext();
	const { mutateAsync } = api.services.uploadImage.useMutation({
		onSuccess() {
			utils.services.getUserImages.invalidate();
		},
	});

	const handleCancelEntityClick = async () => {
		setName("");
		setEntityImg([]);
		setShowGalleryUpload(false);
		setIsOpen(false);
	};

	const handleCreateEntitySubmit = async () => {
		setShowGalleryUpload(!!name);
		setIsOpen(false);
	};

	const handleImageUpload = async (imgs: File[]) => {
		if (imgs.length < MIN_IMG_COUNT) {
			alert(`can't upload less than ${MIN_IMG_COUNT} images`);
			return;
		} else if (imgs.length >= MAX_IMG_COUNT) {
			alert(`can't upload more than ${MAX_IMG_COUNT} images`);
			return;
		}
		setGalleryUploadLoading(true);
		let entityImgUrl: string | undefined;
		if (entityImg[0]) {
			const res = await mutateAsync({
				picture: (await toBase64(entityImg[0])) as string,
			});
			entityImgUrl = res.url;
		}
		const entity = await createEntity({
			name,
			picture: entityImgUrl,
		});
		await utils.entity.getEntities.invalidate();
		try {
			for (let i = 0; i < imgs.length; i++) {
				const image = imgs[i]
				if (image) {
					const img = (await toBase64(image)) as string;
					await mutateAsync({ picture: img, entityId: entity.id });
				}
			}
		} catch (error) { console.log(error) }
		finally {
			setGalleryUploadLoading(false);
			setShowGalleryUpload(false);
		}
	};
	const handleAddEntityClick = async () => {
		setIsOpen(true);
	};
	return (
		<EntityContext.Provider
			value={{
				closeModal,
				entityImg,
				setEntityImg,
				showGalleryUpload,
				galleryUploadLoading,
				name,
				setName,
				handleAddEntityClick,
				handleCreateEntitySubmit,
				handleCancelEntityClick,
				handleImageUpload,
				isOpen,
			}}
		>
			{children}
		</EntityContext.Provider>
	);
};
