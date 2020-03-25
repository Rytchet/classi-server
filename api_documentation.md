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
  - Required: title, price (int), location: {postcode}
  - Optional: description, phone, email, car: {make, model, year, mileage}
- Returns: The created listing

#### Delete a listing

    DELETE /api/listings/:listing_id

- Access: Private
- Parameters: none
- Returns: 200 OK and {success: true} on success, 404 Not Found and {success: false} on failure

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
- Returns: 200 OK or 403 Forbidden for wrong file type

#### Delete User avatar

    DELETE /api/images/avatars

- Access: Private
- Parameters: none
- Returns: 200 OK

#### Listing photos

    POST /api/images/listings/:listing_id

- Access: Private
- Parameters: A list of .jpg or .png files (can be mixed) in form-data, with Key "photos[]"
- Returns: 200 OK or 403 Forbidden for wrong file types
