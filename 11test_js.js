const axios = require('axios');
const qs = require('qs');

const utils = require('./utils');
const Env = utils.Env;
const getData = utils.getData;

const $ = new Env('test_js');
const COOKIES_TESTJS = getData().TESTJS;
