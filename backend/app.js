const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const User = require('./models/login');
const RealEstate = require('./models/realestate');
const Offer = require('./models/offer');
const { ComponentFactoryResolver } = require('@angular/core');
const Message = require('./models/message');
const Block = require('./models/block');
const Archive = require('./models/archive');
const { Console } = require('console');


const app = express();

const MYME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
};

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MYME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/login', (req,res,next) => {
  User.find({username: req.body.username, accepted:true}).then( users => {
    user = users[0];
    if (user == undefined) res.status(201).json(null);
    else{
      if (user.password == req.body.password){
        res.status(201).json(user);
      }else{
        res.status(201).json(null);
      }
    }
  });

});

app.use('/login', (req,res,next) => {
  const message = "This is comming from server";
  res.status(200).json(message);
});

app.post('/register', multer({storage : storage}).single("image"), (req,res,next) => {
  User.findOne({username: req.body.username}).then( user => {

    if (user){
      res.status(201).json("Username already exist");
    }else{
      const url = req.protocol + '://' + req.get("host");
      const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: req.body.password,
        imagePath: url + "/images/" + req.file.filename,
        email: req.body.email,
        state: req.body.state,
        town: req.body.town,
        type: "user",
        accepted: false
      });
      user.save();
      res.status(201).json("Registered");
    }
  });
});

app.post('/add', multer({storage : storage}).single("image"), (req,res,next) => {
  User.findOne({username: req.body.username}).then( user => {

    if (user){
      res.status(201).json("Username already exist");
    }else{
      const url = req.protocol + '://' + req.get("host");
      const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: req.body.password,
        imagePath: url + "/images/" + req.file.filename,
        email: req.body.email,
        state: req.body.state,
        town: req.body.town,
        type: req.body.type,
        accepted: true
      });
      user.save();
      res.status(201).json("Added");
    }
  });
});

app.post('/submitRealEstate', multer({storage : storage}).array("images"), (req,res,next) => {
  const url = req.protocol + '://' + req.get("host");
  var images = [];
  var fileKeys = Object.keys(req.files);
  fileKeys.forEach(function(key) {
    images.push(url + "/images/" + req.files[key].filename)
  });
  const realEstate = new RealEstate({
    name: req.body.name,
    town: req.body.town,
    address: req.body.address,
    township: req.body.township,
    type: req.body.type,
    floor: req.body.floor,
    maximumFloor: req.body.maximumFloor,
    area: req.body.area,
    rooms: req.body.rooms,
    furnished: req.body.furnished,
    owner: req.body.owner,
    RentOrSell: req.body.RentOrSell,
    price: req.body.price,
    images: images,
    accepted: req.body.accepted,
    sold: req.body.sold,
    promoted: req.body.promoted
  });
  realEstate.save();
  res.status(201).json('Bravo');
});

app.post('/addOffer', (req,res,next) => {
  const offer = new Offer({
    name: req.body.name,
    usernameOwner: req.body.usernameOwner,
    usernameBuyer: req.body.usernameBuyer,
    buyerImage: req.body.buyerImage,
    price: req.body.price,
    accepted: req.body.accepted,
    confirmed: req.body.confirmed
  });
  offer.save().then(() => {
    res.status(201).json('Bravo');
  });
});

app.post('/search', (req,res,next) => {

  if (req.body.promoted == null){
    if (!req.body.town){
      RealEstate.find({price: {$gt: req.body.priceFrom, $lt: req.body.priceTo}, accepted:req.body.accepted}).then( realEstates => {
        res.status(201).json(realEstates);
      })
    }else{
      RealEstate.find({price: {$gt: req.body.priceFrom, $lt: req.body.priceTo}, town:req.body.town, accepted:req.body.accepted}).then( realEstates => {
        res.status(201).json(realEstates);
      })
    }
  }else{
    if (!req.body.town){
      RealEstate.find({price: {$gt: req.body.priceFrom, $lt: req.body.priceTo}, accepted:req.body.accepted, promoted: req.body.promoted}).then( realEstates => {
        res.status(201).json(realEstates);
      })
    }else{
      RealEstate.find({price: {$gt: req.body.priceFrom, $lt: req.body.priceTo}, town:req.body.town, accepted:req.body.accepted, promoted: req.body.promoted}).then( realEstates => {
        res.status(201).json(realEstates);
      })
    }
  }
});

app.post('/getMyRealEstates', (req,res,next) => {

  RealEstate.find({owner: req.body.owner, accepted:req.body.accepted}).then( realEstates => {
    res.status(201).json(realEstates);
  })

});

app.post('/getOffers', (req,res,next) => {

  Offer.find({name: req.body.name}).then( offers => {
    res.status(201).json(offers);
  })

});

app.post('/getOffersByNameAndBuyer', (req,res,next) => {

  Offer.find({name: req.body.name, usernameBuyer: req.body.usernameBuyer}).then( offers => {
    res.status(201).json(offers);
  })

});

app.post('/getAllOffers', (req,res,next) => {

  Offer.find({accepted: true}).then( offers => {
    res.status(201).json(offers);
  })
});

app.post('/getConfirmedOffers', (req,res,next) => {

  Offer.find({confirmed: true}).then( offers => {
    res.status(201).json(offers);
  })
});

app.post('/getAllOffersFalse', (req,res,next) => {

  Offer.find({accepted: false}).then( offers => {
    res.status(201).json(offers);
  })
});

app.post('/findPromoted', (req,res,next) => {

  RealEstate.find({promoted: true}).then(realEstates => {
    res.status(201).json(realEstates);
  });

});

app.post('/getUsers', (req,res,next) => {

  User.find({ type: {$in: ["user", "agent"]} , accepted: req.body.accepted}).then(users => {
    res.status(201).json(users);
  });

});

app.post('/deleteUser', (req,res,next) => {

  User.deleteOne({ username: req.body.username}).then(users => {
    res.status(201).json("Daa");
  });

});

app.post('/update', (req,res,next) => {
    const user = req.body;
    User.replaceOne({_id: user._id},user).then(user =>{
      res.status(201).json(user);

  });

});

app.post('/updateRealEstate', (req,res,next) => {
  const realEstate = req.body;
  RealEstate.replaceOne({_id: realEstate._id},realEstate).then(re =>{
    res.status(201).json(re);
  });

});

app.post('/updatePicture', multer({storage : storage}).single("image"), (req,res,next) => {
  User.findOne({username: req.body.username}).then( user => {

    if (user){
      const url = req.protocol + '://' + req.get("host");
      const imagePath = url + "/images/" + req.file.filename;
      user.imagePath = imagePath;
      User.replaceOne({_id:user._id}, user).then( user1=> {
        res.status(201).json(user);
      });
    }
  });
});

app.post('/updateRealestate', (req,res,next) => {
  const realEstate = req.body;
  RealEstate.replaceOne({_id: realEstate._id},realEstate).then(user =>{
    res.status(201).json(user);

  });
});

app.post('/acceptOffer', (req,res,next) => {

  Offer.find({name:req.body.name, usernameBuyer: req.body.usernameBuyer, usernameOwner: req.body.usernameOwner}).then( offer =>{
    offer[0].accepted=true;
    Offer.replaceOne({_id: offer[0]._id},offer[0]).then(user =>{
      Offer.deleteMany({name: offer[0].name, _id: {$nin : [offer[0]._id]}}).then( () => {
        res.status(201).json("user");
      });
    });
  })
});

app.post('/confirmOffer', (req,res,next) => {
  const offer = new Offer({
    name: req.body.name,
    usernameOwner: req.body.usernameOwner,
    usernameBuyer: req.body.usernameBuyer,
    buyerImage: req.body.buyerImage,
    price: req.body.price,
    accepted: req.body.accepted,
    confirmed: req.body.confirmed
  });
  offer.confirmed = true;
  RealEstate.findOne({name:offer.name}).then( (realEstate) => {
    offer.price = realEstate.price;
    Offer.deleteMany({name: offer.name}).then( () => {
      Message.deleteMany({name: offer.name}).then( () => {
        offer.save().then( () => {
          res.status(201).json("AAAA");
        })
      })
    })
    ;
  })

});

app.post('/deleteOffer', (req,res,next) => {

  Offer.deleteOne({name:req.body.name, usernameBuyer: req.body.usernameBuyer, usernameOwner: req.body.usernameOwner}).then( offer =>{
    res.status(201).json("obrisano");

  });

});

app.post('/readMessage', (req,res,next) => {
  Message.find({name:req.body.name, usernameFrom: req.body.usernameFrom, usernameTo: req.body.usernameTo}).sort({date:-1}).limit(1).then( message =>{
    message[0].read=true;
    Message.replaceOne({_id: message[0]._id},message[0]).then(user =>{
      res.status(201).json("aaa");
    });
  })
});

app.post('/getEstatesByTown', (req,res,next) => {

  RealEstate.aggregate([
    {$match : {accepted: true}},
    {$group : { _id : "$town", count : {$sum : 1}}}]
  ).then( estates => {
    res.status(201).json(JSON.stringify(estates));
  });

});

app.post('/getEstatesByRentOrSell', (req,res,next) => {

  RealEstate.count({RentOrSell: 'Rent', accepted: true, type: req.body.type}).then( number1 => {

    RealEstate.count({RentOrSell: 'Sell', accepted: true, type: req.body.type}).then( number2 => {

      res.status(201).json(JSON.stringify({number1,number2}));
    })
  })

});

app.post('/getEstatesByPrice', (req,res,next) => {

  RealEstate.count({RentOrSell: 'Sell', accepted: true, price: {$gt : 0, $lt: req.body.to1}}).then( number1 => {

    RealEstate.count({RentOrSell: 'Sell', accepted: true, price: {$gte : req.body.to1, $lt: req.body.to2}}).then( number2 => {

      RealEstate.count({RentOrSell: 'Sell', accepted: true, price: {$gte : req.body.to2, $lt: req.body.to3}}).then( number3 => {

        RealEstate.count({RentOrSell: 'Sell', accepted: true, price: {$gte : req.body.to3, $lt: req.body.to4}}).then( number4 => {

          RealEstate.count({RentOrSell: 'Sell', accepted: true, price: {$gte : req.body.to4}}).then( number5 => {
            res.status(201).json(JSON.stringify({number1,number2,number3,number4,number5}));
          })
        })
      })
    })
  })

});

app.post('/sendMessage', (req,res,next) => {
  const message = new Message({
    name: req.body.name,
    usernameFrom: req.body.usernameFrom,
    usernameTo: req.body.usernameTo,
    agent: req.body.agent,
    text: req.body.text,
    date: req.body.date,
    read: req.body.read
  });
  message.save();
  Archive.deleteOne({usernameFrom: req.body.usernameTo, usernameTo: req.body.usernameFrom}).then( () => {
    Archive.deleteOne({usernameFrom: req.body.usernameFrom, usernameTo: req.body.usernameTo}).then( () => {
      res.status(201).json('Bravo');
    })
  })
});

app.post('/findChannels', (req,res,next) => {
  var messages = [{
    date:null,
    ostalo:null
  }];

  var returnvalue=[{
    usernameFrom:null,
    messages: messages
  }];
  Message.aggregate([
    {$match : {usernameTo: req.body.usernameTo}},
    {$group : { _id : "$usernameFrom"}}]
  ).then( channels => {
    var i = 0;
    channels.forEach(element => {
      Message.find({usernameTo: {$in: [req.body.usernameTo, element._id]}, usernameFrom: {$in: [element._id, req.body.usernameTo]}}).sort({date: 1}).then( messages => {
        i++;
        returnvalue.push({usernameFrom:element._id, messages: messages});
        if (i == channels.length){
          returnvalue.sort(function (a,b){
            return b.messages[b.messages.length-1].date-a.messages[a.messages.length-1].date;
          });
          res.status(201).json(JSON.stringify(returnvalue));
        }
      })
    });
  });
});

app.post('/getMyBlocks', (req,res,next) => {

  Block.find({ $or: [{usernameFrom: req.body.username},{usernameTo: req.body.username} ] } ).then( blocks => {
    res.status(201).json(JSON.stringify(blocks));
  });

});

app.post('/block', (req,res,next) => {

  const block = new Block({
    usernameFrom: req.body.usernameFrom,
    usernameTo: req.body.usernameTo
  });
  block.save().then( () => {
    const archive = new Archive({
      usernameFrom: req.body.usernameFrom,
      usernameTo: req.body.usernameTo
    });
    archive.save().then( () => {
      res.status(201).json("proslo");
    });

  });

});

app.post('/unblock', (req,res,next) => {

  Block.deleteMany({usernameFrom: req.body.usernameFrom,usernameTo: req.body.usernameTo}).then( () => {
    Archive.deleteMany({
      usernameFrom: req.body.usernameFrom,
      usernameTo: req.body.usernameTo
    }).then(() => {
      res.status(201).json("proslo");
    })
  })

});

app.post('/getMyArchives', (req,res,next) => {

  Archive.find({usernameFrom: req.body.usernameFrom}).then( archives => {
    res.status(201).json(archives);
  });

});

app.post('/archive', (req,res,next) => {
  const archive = new Archive({
    usernameFrom: req.body.usernameFrom,
    usernameTo: req.body.usernameTo
  });
  archive.save().then( () => {
    res.status(201).json("proslo");
  })
});

app.post('/dearchive', (req,res,next) => {
  Archive.deleteOne({
    usernameFrom: req.body.usernameFrom,
    usernameTo: req.body.usernameTo
  }).then(() => {
    res.status(201).json("proslo");
  })
});

module.exports = app;
