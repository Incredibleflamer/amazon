# documentation

## configs.json:

```json
{
  "port": 8080, // port where backend and website is working
  "mongodb_url": "url to link database",
  "image_api_key": "api key to upload your images to imgbb",
  "cookie_string": "some random secure string",
  "admin_pass": "pass you will use to login as admin",
  "admin_username": "username you will use to login as admin"
}
```

## routes & api

1. admin routes :

[ api ]

- /login - match the username and pass and log them in
- /api/productadd - the details entered by user we send a post request to this endpoint

[ routes ]

- /admin - basicaly login page for admin which send data with post request to /login
- /dashboard - after logic admin is redirected to this page
- /admin_logout - it removes the save cookies of username and pass
- /productadd - basically its page for admin to add new products to database

2. public routes :

[ routes ]

- /404 - error page of saying url is not found
- /products - to show all products
- /login - login page for users
- /signup - signup page for users

[ api ]

- none

# common questions

## how we add product to database?

1. we take input from user
2. then upload that images to imagebb and we get a url to that image
3. we save all info given by user to database including url

## database fetch products

1. we fetch all product from database and send it to page where we wanna use the data using ejs
2. using html and ejs & loop we show all products
