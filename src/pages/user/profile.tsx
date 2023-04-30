import React from "react";
import { api } from "../../utils/api";
import { ProfilePage } from "../../components/wrappedPages/ProfilePage";
import { ClipLoader } from "react-spinners";

export default function ProfilePageContainer() {
  const {
    data: personalDetails,
    isLoading,
    error,
  } = api.user.getUserDetails.useQuery();

  if (error) {
    return <div>Failed to load product {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-skin-main">
        <ClipLoader color="white" />
      </div>
    );
  }

  return <ProfilePage personalDetails={personalDetails} />;
}
