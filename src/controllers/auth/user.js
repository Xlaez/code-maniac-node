const Users = require("../../models/auth/user");
const encrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// Initialiazing nodemailer
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kamounation@gmail.com",
    pass: "kamoucares",
  },
});

exports.postNewUser = (req, res) => {
  const username = req.body.username;
  const email_address = req.body.email_address;
  const password = req.body.password;
  const gender = req.body.gender;

  Users.findOne({ username: username })
    .then((userDoc) => {
      if (userDoc) {
        res.status(404).json({ username: username });
      }
      return encrypt.hash(password, 7).then((hashedPassword) => {
        const user = new Users({
          username: username,
          email_address: email_address,
          password: hashedPassword,
          gender: gender,
        });
        user.save();
        return res.status(201).send("users created");
      });
      // .then((result) => {
      //   const maildetails = {
      //     from: "noob@gmail.com",
      //     to: email_address,
      //     subject: "you have successfully signuped to codeManiac",
      //     text: "Node.js test working!",
      //   };
      //   mailTransporter.sendMail(maildetails, (err, data) => {
      //     if (err) {
      //       res.send("an erro occured");
      //     } else {
      //       res.send("email sent successfully");
      //     }
      //   });
      // });
    })
    .catch((err) => {
      return res.status(401).json(err);
    });
};

exports.postLogin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email_address = req.body.email_address;

  Users.findOne({ uername: username })
    .then((user) => {
      if (!user) return res.status(404).send("user not found");
      encrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(username, process.env.TOKEN_SECRET);
          res.status(201).json({ token: token });
        }
      });
      // .then((result) => {
      //   const maildetails = {
      //     from: "noobie@gmail.com",
      //     to: email_address,
      //     subject: "you have successfully logged into your account",
      //     text: "Node.js test working!",
      //   };
      //   mailTransporter.sendMail(maildetails, (err, data) => {
      //     if (err) {
      //       res.send("an error occured");
      //     } else {
      //       res.send("email sent successfully");
      //     }
      //   });
      // });
      return res.status(400).json({ message: "login successful" });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

exports.postResetUser = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err)
      return res.status(400).send("error while generating hexed crypto value");
    const cryptoToken = buffer.toString("hex");
    Users.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          res.status(400).send("No user with this credentials found!");
        }
        user.resetToken = cryptoToken;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        const maildetails = {
          from: "noobie@gmail.com",
          to: email_address,
          subject: "Your codemaniac rest token",
          email_address,
          // html: `<p> ${req.body.username} Dear your Codemaniac reset token is ${cryptoToken}</p>`,
        };
        mailTransporter.sendMail(maildetails, (err, data) => {
          if (err) {
            res.send("an error occured");
          } else {
            res.send("email sent successfully");
          }
        });
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  Users.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((result) => {
      return res.status(200).send({
        userId: result._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

exports.postNewPassword = (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const email_address = req.body.email_address;
  const username = req.body.username;

  let resetUser;

  Users.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return encrypt(newPassword, 12)
        .then((hashedPassword) => {
          resetUser.password = hashedPassword;
          resetUser.resetTokenExpiration = undefined;
          resetUser.resetToken = undefined;
          return resetUser.save();
        })
        .then((result) => {
          const maildetails = {
            from: "noobie@gmail.com",
            to: email_address,
            subject: "password reset successful",
            email_address,
            html: `<p> Dear ${username} your new password has been set to ${hashedPassword}</p> <br> <p><a href="http://localhost:3000/blog/">Click here to visit CodeManiac</a></p>`,
          };
          mailTransporter.sendMail(maildetails, (err, data) => {
            if (err) {
              res.send("an error occured");
            } else {
              res.send("email sent successfully");
            }
          });
          return res.status(201).json({ userId: userId });
        });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};
