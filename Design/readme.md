# Prefix:

# /api/v1/

# Listings

## Create a listing

`POST /listings`

## Retrieve all listings

`GET /listings`

Parameters:

**year** - Integer - for this year

**decade** - Integer - for this decade (in form of 1960, 1970 etc)

**term** - String - containing this term in title

**make** - String - of this Make

**model** - String - of this Model

## Delete a listing

`DELETE /listings/<id>`

## Change a listing

`PATCH /listings/<id>`

# Users

## Create a user

`POST /users`

## Retrieve all users

`GET /users`

## Delete a user

`DELETE /users/<id>`

## Change a user

`PATCH /users/<id>`
