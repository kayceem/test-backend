const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");
const Order = require("../models/Order");
const { FRONTEND_URL } = require("../config/frontend-domain");

const vnpaymentConfig = require("../config/vnpayment_config.json");

exports.createVnpayUrl = async (req, res, next) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  try {
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = vnpaymentConfig.vnp_TmnCode;
    let secretKey = vnpaymentConfig.vnp_HashSecret;
    let vnpUrl = vnpaymentConfig.vnp_Url;
    let returnUrl = vnpaymentConfig.vnp_ReturnUrl;
    let orderId = req.body.orderId;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language || "vn";
    let currCode = "VND";
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.json({ redirectUrl: vnpUrl });
  } catch (error) {
    next(error);
  }
};

exports.handleVnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = vnpaymentConfig.vnp_TmnCode;
    let secretKey = vnpaymentConfig.vnp_HashSecret;

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const orderId = vnp_Params["vnp_TxnRef"];
      const transactionStatus = vnp_Params["vnp_TransactionStatus"];

      if (transactionStatus === "00") {
        const updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          { status: "Success" },
          { new: true }
        );

        if (updatedOrder) {
          res.redirect(`${FRONTEND_URL}/order-completed?orderId=${orderId}`);
        } else {
          res.send("Error: Order not found");
        }
      } else {
        const canceledOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          { status: "Cancelled" },
          { new: true }
        );
        if (canceledOrder) {
          res.send("Payment Failed. The order has been cancelled.");
        } else {
          res.send("Error: Order not found");
        }
      }
    } else {
      res.send("Error");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let key of str) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}
