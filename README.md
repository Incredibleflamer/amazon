# documentation

## configs.json:

```json
{
  "port": 8080, // port where backend and website is working
  "mongodb_url": "url to link database", // get this from mongodb
  "image_api_key": "api key to upload your images to imgbb", // get this from imgbb
  "cookie_string": "some random secure string", // random key can be anything
  "admin_pass": "pass you will use to login as admin", // password
  "admin_username": "username you will use to login as admin" // username
}
```

## features

1. login & signup
2. add to cart
3. info about past order
4. payment gateway [ shows qr code ( cant trace back payment success or not) ]
5. new product add
6. product info
7. add comments
8. diffrent login page for admin
9. 404 error page [ page not found ]
10. saves all images in imagebb server
11. saves all data in mongodb
12. runs express server in backend which fetches and sends all data to front end

## routes & api

1. admin routes :

[ api ]

- /login - match the username and pass and log them in
- /api/productadd - the details entered by user we send a post request to this endpoint

[ routes ]

- /admin - basicaly login page for admin which send data with post request to /login and saves pass and username in cookie
- /dashboard - after login admin is redirected to this page
- /admin_logout - it removes the saved cookies of admin username and pass
- /productadd - basically its page for admin to add new products to database

2. public routes :

[ routes ]

- / - home page
- /404 - error page of saying url is not found
- /login - login page for users
- /signup - signup page for users
- /profile - shows user profile and past orders
- /cart - shows users cart
- /gateway - payment gateway
- /product-info/:productname - shows info about products
- /shop - shows all products
- /shop/Electronics - shows all Electronics products
- /shop/Toys - shows all Toys products
- /shop/Clothing - shows all Clothing products
- /shop/Jewellery - shows all Jewellery products

[ api ]

- /api/user/signup - handles signup requests
- /api/user/login - handles login requests
- /api/cart/update - handles cart add and remove requests
- /api/comment/add - adds comments

## Security

1. stores userid in session for 1 day then delete that userid is fetched by database
2. stores encrypted passwords in database
3. check session userid to check if user is logged in or not
