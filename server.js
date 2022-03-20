/*
server.js – Configures the Plaid client and uses Express to defines routes that call Plaid endpoints in the Sandbox environment.
Utilizes the official Plaid node.js client library to make calls to the Plaid API.
*/

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const path = require("path");
const app = express();

app.use(
  // FOR DEMO PURPOSES ONLY
  // Use an actual secret key in production
  session({ secret: "bosco", saveUninitialized: true, resave: true })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/oauth", async (req, res) => {
  res.sendFile(path.join(__dirname, "oauth.html"));
});

// Configuration for the Plaid client
const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

//Instantiate the Plaid client with the configuration
const client = new PlaidApi(config);

//Creates a Link token and return it
app.get("/api/create_link_token", async (req, res, next) => {
  const tokenResponse = await client.linkTokenCreate({
    user: { client_user_id: req.sessionID },
    client_name: "Plaid's Tiny Quickstart",
    language: "en",
    products: ["auth"],
    country_codes: ["US"],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
  });
  res.json(tokenResponse.data);
});

// Exchanges the public token from Plaid Link for an access token
app.post("/api/exchange_public_token", async (req, res, next) => {
  const exchangeResponse = await client.itemPublicTokenExchange({
    public_token: req.body.public_token,
  });

  // FOR DEMO PURPOSES ONLY
  // Store access_token in DB instead of session storage
  req.session.access_token = exchangeResponse.data.access_token;
  res.json(true);
});

// Fetches balance data using the Node client library for Plaid
app.get("/api/data", async (req, res, next) => {
  const access_token = req.session.access_token;
  const balanceResponse = await client.accountsBalanceGet({ access_token });
  res.json({
    Balance: balanceResponse.data,
  });
});

app.get("/api/user", async (req, res, next) => {
  const access_token = req.session.access_token;
  const userResponse = await client.identityGet({ access_token });
  res.json({
    User: userResponse.data,
  });
})

app.get("/api/transactions", async (req, res, next) => {
  const access_token = req.session.access_token;
  var td = new Date();
  var end_date = td.toLocaleDateString('en-GB').split('/').reverse().join('-')
  td.setMonth(td.getMonth() - 12);
  var start_date = td.toLocaleDateString('en-GB').split('/').reverse().join('-')
  console.log(end_date)
  console.log(start_date)
  try {
    const transactionsResponse = await client.transactionsGet(
    { 
      access_token: access_token, 
      start_date: start_date, 
      end_date: end_date 
    });
    let transactions = transactionsResponse.data.transactions;
    const total_transactions = transactionsResponse.data.total_transactions;
    var paginatedResponse;
    while (transactions.length < total_transactions) {
      paginatedResponse = await client.transactionsGet(
      {
        access_token: access_token,
        start_date: start_date, 
        end_date: end_date,
        options: {
          offset: transactions.length,
        },
      });
      transactions = transactions.concat(
        paginatedResponse.data.transactions,
      );
    }
    res.json({
      Transactions: transactions.data,
    });
  } catch(err) {
    // handle error
    console.log(err)
  };
});
// Checks whether the user's account is connected, called
// in index.html when redirected from oauth.html
app.get("/api/is_account_connected", async (req, res, next) => {
  return (req.session.access_token ? res.json({ status: true }) : res.json({ status: false}));
});

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);
