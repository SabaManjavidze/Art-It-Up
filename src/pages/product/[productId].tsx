import { useRouter } from "next/router";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import ProductPage from "../../components/wrappedPages/ProductDetailsPage";
import { api } from "../../utils/api";
import type { Product } from "@kastlabs/printify-client";

const ProductPageContainer = () => {
  const router = useRouter();
  const productId = router.query.productId as string;
  const {
    data: product,
    isLoading,
    error,
    isSuccess,
    refetch,
  } = api.printify.getPrintifyProduct.useQuery(
    {
      id: productId,
    },
    { enabled: false }
  );

  useEffect(() => {
    if (productId) refetch();
  }, [productId]);

  if (!isSuccess && error) {
    return <div>Failed to load product {error?.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-skin-main">
        <ClipLoader color="white" />
      </div>
    );
  }
  return <ProductPage product={product as Product} />;
};

export default ProductPageContainer;
