const pgp = require('pg-promise')();

const connectionString = 'postgres://mplxtoaopbcroq:051caeb76d6dea686ab6e994df3e5b511bdfe96ad888636fe3810d51fd046fd6@ec2-54-204-45-43.compute-1.amazonaws.com:5432/damgfej95osv3p';
pgp.pg.defaults.ssl = true;

export default pgp(connectionString);
