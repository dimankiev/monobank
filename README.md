# monobank Web Client
monobank readonly Web client, based on [monobank Public API](https://api.monobank.ua/docs/)

## About
Monobank Web Client, written in JS (JSX) + React + Axios, based on monobank open API.

## Features
 - Optimized for mobile phones
 - View cardholder name at the top of the page
 - View exchange rates (USD sell/buy, EUR sell/buy)
 - View current balance of a card with credit limit and it's number
 - View the card currency
 - Cards are sorted by balance and by currency. So 80 USD > 80 UAH

## Advantages
 - Easily check the balance of any of your cards
 - Easily set the API key of your account
 - No Cookies (localStorage only)
 - Refresh and get actual information every 60 seconds
 - Actual exchange rates every 5 mins

## FAQ
#### Why my balance is negative ?
If you're using credit money - balance will be negative
#### Why the exchange rates 1/1 USD and 1/1 EUR ?
It happens rarely, sorry. You have to wait some time
 
## Resources
 * monobank Public API - https://api.monobank.ua/docs/
 * axios - https://github.com/axios/axios
 * React - https://reactjs.org/
 * Google Product Sans (non-commerce usage) - https://fonts.google.com/license/productsans

## Contacts
 * [Telegram](https://t.me/dimankiev_host)
