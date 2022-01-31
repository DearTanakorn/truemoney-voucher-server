var express = require('express');
var app = express();

// Set express to accept reverse proxy
app.set('trust proxy', true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const axios = require('axios');

app.get('/:phonenumber/:code', async (req, res) => {
  let TWPhoneNum = req.params.phonenumber;
  let code = req.params.code;
  try {
    var response = await axios({
      method: 'post',
      url: 'https://gift.truemoney.com/campaign/vouchers/' + code + '/redeem',
      headers: {
        accept: 'application/json',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-length': '59',
        'content-type': 'application/json',
        origin: 'https://gift.truemoney.com',
        referer: 'https://gift.truemoney.com/campaign/?v=' + code,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.66',
      },
      data: {
        mobile: TWPhoneNum,
        voucher_hash: code,
      },
    });

    return res.json(response.data);
  } catch (err) {
    if (err.response) {
      if (err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
    }
    console.log(err);

    return res.status(500).json({ status: false, message: 'เกิดข้อผิดพลาด!' });
  }
});

// Handle error
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);

    return res.status(500).send();
  } else {
    next();
  }
});

// Handle unknown routes
app.all('*', (req, res) => res.status(404).send());

var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 3001;
var url = process.env.URL || 'http://localhost:3001';

app.listen(port, host, () => {
  console.log(`Listening on (${host}:${port})`, url);
});
