export const BLANK_PROFILE_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
export const WHITELIST_SESS_KEY = "whitelist";
export const MODAL_SESS = "modal";
export const IMG2IMG_COST = 30;
export const REFERRAL_CREDITS = 30;

export const SIZES_PROP =
  "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
export const MAX_IMAGE_COUNT = 15;

export const MAX_CART_PRODUCT = 20;
export const MAX_WISHLIST_PRODUCT = 30;

export const SIGNIN_ROUTE = "/";

export const COMEBACK_MESSAGE = "come back😢😢";

export const PublicKeys = {
  "country": "1",
  "region": "2",
  "address1": "3",
  "address2": "4",
  "zip": "5",
};

export const invitationConfirmEmail = (
  inviterName: string,
  userName: string,
  userImage: string
) => `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      color: #333333;
    }
    .confirmation-letter {
      margin-top: 20px;
      color: #555555;
    }
    .user-profile {
      display: flex;
      align-items: center;
      margin-top: 20px;
    }
    .user-info {
      display: flex;
      align-items: center;
      height: 100%;
      margin-left: 15px;
      color: #555555;
    }
    .user-name {
      font-size: 18px;
      font-weight: bold;
    }
    .profile-picture {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Invitation Confirmed!</h2>
    </div>
    <div class="confirmation-letter">
      <p>Dear ${inviterName},</p>
      <p>${userName} Has accepted your invitation  We are excited to welcome him/her to our community!</p>
    </div>
    <div class="user-profile">
      <div class="profile-picture">
        <img src="${userImage}" alt="Profile Picture">
      </div>
      <div class="user-info">
        <div class="user-name">${userName}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

export const LOREM_IPSUM = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
tenetur error, harum nesciunt ipsum debitis quas aliquid`;
