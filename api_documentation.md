For every request you need to have a header with Key: "Content-Type" and Value: "application/json"

For routes with Private Access, you need to add a header with Key: "x-auth-token" and Value being the User token

All parameters are Strings unless specified otherwise

## Users and authentication

#### Creating a user:

    POST /api/users

- Access: Public
- Parameters: name, email, password
- Returns: token, id, name, email

#### Authenticating a user

    POST /api/auth

- Access: Public
- Parameters: email, password
- Returns: token, id, name, email

#### Get private user data

    GET /api/auth/user

- Access: Private
- Parameters: none
- Returns: All user data (except password)

#### Favorite a listing

    PUT /api/users/favorites/:listing_id

- Access: Private
- Parameters: none
- Returns: A status message

#### Unfavorite a listing

    DELETE /api/users/favorites/:listing_id

- Access: Private
- Parameters: none
- Returns: A status message

## Listings

#### Getting all listings

    GET /api/listings

- Access: Public
- Parameters: none
- Returns: A list of all listings, sorted by date descending

#### Getting a single listing

    GET /api/listings/:listing_id

- Access: Public
- Parameters: none
- Returns: All data for a single listing

#### Create a listing

    POST /api/listings

- Access: Private
- Parameters:

  - Required: title, price (int), location: {postcode}, car: {make, model, year (int)}
  - Optional: description, phone, email, car: {mileage}

  If phone and email are not specified they are taken from the user model

- Returns: The created listing

#### Delete a listing

    DELETE /api/listings/:listing_id

- Access: Private
- Parameters: none
- Returns: Status message

#### Get most viewed listings

    GET /api/listings/popular

- Access: Public
- Parameters: none
- Returns: A list of all listings, sorted by times_viewed descending

## Images

#### Add or change User avatar

    POST /api/images/avatars

- Access: Private
- Parameters: A .jpg or .png file in form-data of the request, with Key "avatar"
- Returns: Status message

#### Delete User avatar

    DELETE /api/images/avatars

- Access: Private
- Parameters: none
- Returns: Status message

#### Listing photos

    POST /api/images/listings/:listing_id

- Access: Private
- Parameters: A list of .jpg or .png files (can be mixed) in form-data, with Key "photos[]"
- Returns: Status message
