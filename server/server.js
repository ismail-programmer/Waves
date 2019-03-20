//! require statements for dependices
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const cloudinary = require('cloudinary');
const async = require('async');
const moment = require('moment');


require('dotenv').config();

//! cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

//!calling the librarires
const app = express();

//! mongoose configration
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

//!using middle ware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('client/build'))

// ! require Models
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');
const { Site } = require('./models/site');
const { Payment } = require('./models/payment');


//! require middle wares
const { auth } = require('./middleWare/auth');
const { admin } = require('./middleWare/admin');

// ! utils requires

const { sendEmail } = require('./utils/mails/index');

//*****************************************
//!       SHOP
//*****************************************

app.post('/api/product/shop', (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  findArgs['publish'] = true;

  Product.find(findArgs)
    .populate('brand')
    .populate('wood')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, articles) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        size: articles.length,
        articles
      });
    });
});
//*****************************************
// ! Route for products
//*****************************************

app.post('/api/product/article', auth, admin, (req, res) => {
  const product = new Product(req.body);

  product.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      article: doc
    });
  });
});

//todo  remove image

app.get('/api/users/removeimage', auth, admin, (req, res) => {
  let image_id = req.query.public_id;

  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) return res.json({ succes: false, error });
    res.status(200).send('ok');
  });
});

//todo upload image
app.post('/api/users/uploadimage', auth, admin, formidable(), (req, res) => {
  cloudinary.uploader.upload(
    req.files.file.path,
    result => {
      res.status(200).send({
        public_id: result.public_id,
        url: result.url
      });
    },
    {
      public_id: `${Date.now()}`,
      resource_type: 'auto'
    }
  );
});

// todo 1.Products find by ARRIVAl    sortBy=createdAt
// todo 2.Products find by SELL        sortBy=sold

app.get('/api/product/articles', (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  Product.find()
    .populate('brand')
    .populate('wood')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, articles) => {
      if (err) return res.status(400).send(err);
      res.send(articles);
    });
});

// todo 3.PRODUCTS FINDING BY ID

app.get('/api/product/articles_by_id', (req, res) => {
  let type = req.query.type;
  let items = req.query.id;

  if (type === 'array') {
    let ids = req.query.id.split(',');
    items = [];
    items = ids.map(item => {
      return mongoose.Types.ObjectId(item);
    });
  }

  Product.find({ _id: { $in: items } })
    .populate('brand')
    .populate('wood')
    .exec((err, docs) => {
      return res.status(200).send(docs);
    });
});

//*****************************************
//! Route for WOODS
//*****************************************

app.post('/api/product/wood', auth, admin, (req, res) => {
  const wood = new Wood(req.body);
  wood.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      wood: doc
    });
  });
});

//todo 1.Route for getting woods

app.get('/api/product/get_woods', (req, res) => {
  Wood.find({}, (err, woods) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(woods);
  });
});

//*****************************************
//! ROUTE FOR BRANDS
//*****************************************

app.post('/api/product/brand', auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      brand: doc
    });
  });
});

//todo 1.route for geting brands

app.get('/api/product/get_brands', (req, res) => {
  Brand.find({}, (err, brands) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(brands);
  });
});

//*****************************************
// ! route of user authooration for some additional routes
//*****************************************

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history
  });
});

//*****************************************
// ! Registering USERS route
//*****************************************

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    sendEmail(doc.email, doc.firstname, null, 'welcome');
    return res.status(200).json({
      success: true
    });
  });
});

// todo sending mail for reset password

app.post('/api/users/reset_user', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user)
      user.generateResetToken((err, user) => {
        if (err) return res.json({ success: false, err });
        sendEmail(user.email, user.firstname, null, 'reset_password', user);
        return res.json({ success: true });
      });
    else {
      return res.json({ success: false });
    }
  });
});


//todo reset password

app.post('/api/users/reset_password',(req,res)=>{

  var today = moment().startOf('day').valueOf();
  User.findOne({
    resetToken:req.body.resetToken,
    resetTokenExp:{
      $gt: today
    }
    
  },(err,user)=>{
    if(!user) return res.json({succes:false,message:'Sorry, Dont Find A Token.Please Generate it Again!'})

    user.password = req.body.password;
    user.resetToken = '';
    user.resetTokenExp = '';
    user.save((err,doc)=>{
      if(err) return res.json({success:false,err});
      return res.status(200).json({
        success:true
      })
    })

  })




})




// todo    Route to adding items in cart

app.post('/api/users/addToCart', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, doc) => {
    let duplicate = false;

    doc.cart.forEach(item => {
      if (item.id == req.query.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      User.findOneAndUpdate(
        {
          _id: req.user._id,
          'cart.id': mongoose.Types.ObjectId(req.query.productId)
        },
        { $inc: { 'cart.$.quantity': 1 } },
        { new: true },
        () => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(doc.cart);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: mongoose.Types.ObjectId(req.query.productId),
              quantity: 1,
              date: Date.now()
            }
          }
        },
        { new: true },
        (err, doc) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(doc.cart);
        }
      );
    }
  });
});

// todo     removing items from cart

app.get('/api/users/removeFromCart', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { cart: { id: mongoose.Types.ObjectId(req.query._id) } } },
    { new: true },
    (err, doc) => {
      let cart = doc.cart;
      let array = cart.map(item => {
        return mongoose.Types.ObjectId(item.id);
      });

      Product.find({ _id: { $in: array } })
        .populate('brand')
        .populate('wood')
        .exec((err, cartDetail) => {
          return res.status(200).json({
            cartDetail,
            cart
          });
        });
    }
  );
});

// todo updating User info

app.post('/api/users/update_profile', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: req.body
    },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json({ success: true });
    }
  );
});

// !Place Order
app.post('/api/users/buy', auth, (req, res) => {
  const products = req.body.cartItems.map(item => {
    return {
      dataOfPurchase: Date.now(),
      name: item.name,
      brand: item.brand,
      id: item._id,
      price: item.price,
      quantity: item.quantity
    };
  });

  const user = {
    id: req.user._id,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email
  };

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: products }, $set: { cart: [] } },
    { new: true },
    (err, doc) => {
      if (err) return res.status(400).json({ success: false, err });

      const payment = new Payment({ user, products });

      payment.save((err, doc) => {
        if (err) return res.status(400).json({ success: false, err });

        const products = doc.products.map(item => {
          return { id: item.id, quantity: item.quantity };
        });

        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              { _id: item.id },
              { $inc: { sold: item.quantity } },
              { new: false },
              callback
            );
          },
          err => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true, cart: [] });
          }
        );
      });
    }
  );
});

//*****************************************
//! login route
//*****************************************

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({ loginSuccess: false, message: 'Email not Found' });
    //todo Compairinng password
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong Password' });
      // todo Genarting password
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie('w_auth', user.token)
          .status(200)
          .json({
            loginSuccess: true
          });
      });
    });
  });
});

//*****************************************
//! logout route
//*****************************************

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

//*****************************************
// ! Site
//*****************************************

// todo  get data of site

app.get('/api/site/site_data', (req, res) => {
  Site.find({}, (err, site) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(site[0].siteInfo);
  });
});

// todo update data of site info

app.post('/api/site/site_data', auth, admin, (req, res) => {
  Site.findOneAndUpdate(
    { name: 'Site' },
    { $set: { siteInfo: req.body } },
    { new: true },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
        siteInfo: doc.siteInfo
      });
    }
  );
});





// ! DEFAULT CASE

if(process.env.NODE_ENV === 'production'){
  const path = require('path');
  app.get('/*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../client","build","index.html"))
  })
}


//*****************************************
// ! listening port
//*****************************************

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Running at ${port}`);
});
