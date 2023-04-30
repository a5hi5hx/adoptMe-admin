const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const Booking = require('../models/book.model');
const Pets = require("../models/pets.model");
const UserDetails = require("../models/user.detail.model");
require("dotenv").config();

const users = [
  {
    id: 1,
    username: process.env.adminusername,
    password: process.env.adminpassword
  }
];

// Authentication middleware
const authenticateUser = (req, res, next) => {
  if (req.session && req.session.user) {
    // If user is authenticated, proceed to next middleware
    return next();
  } else {
    // If user is not authenticated, redirect to login page
    return res.redirect('/');
  }
};
router.get('/login', (req, res)=> {
res.render("login");
});
// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user with the given username and password
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    // Set the user session data
    req.session.user = { id: user.id, username: user.username };
    // Redirect to the dashboard
   
    res.redirect('/admin/home');
  } else {
    // Set an error message in the session data
    req.session.message = 'Invalid username or password';
    // Redirect to the login page
    res.redirect('/admin/login');
  }
});

// Dashboard endpoint
router.get('/home', authenticateUser, async (req, res) => {
  
  // Render the dashboard page
  try {
    const pets = await Pets.countDocuments();
    const bookings = await Booking.countDocuments();
    const users = await User.countDocuments();
    const homedata = {
      pet: pets,
      booking: bookings,
      user: users,
    };
    
    res.render('dashboard', { homeData: homedata });
  } catch (err) {
    console.log(err);
    const homedata = {
      pet: 'err',
      booking: 'err',
      user: 'err',
    };
    res.render('dashboard', { homeData: homedata });
  }});

  router.get('/bookings', authenticateUser, async (req, res) => {
    try {
      const bookings = await Booking.find().populate('user').populate('pet');
      const bookingsData = [];
      for (let i = 0; i < bookings.length; i++) {
        const userDetail = await UserDetail.findOne({ _id: bookings[i].user._id });
        const pet = await Pet.findOne({ _id: bookings[i].pet._id });
        const bookingData = {
          user: {
            name: userDetail.name,
            phone: userDetail.phone,
            email: userDetail.email,
            address: userDetail.address,
          },
          pet: {
            name: pet.nickname,
            category: pet.category,
            image: pet.image,
          },
          date: bookings[i].date,
          time: bookings[i].time,
        };
        bookingsData.push(bookingData);
      }
      res.render('booking', { bookings: bookingsData });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  });

  router.get("/users", authenticateUser,async (req, res) => {
    try {
      const users =  await UserDetails.find().populate('_id');
      const userDetails = [];
      for (let i=0; i<users.length; i++)
      {
          const userD = await User.findOne({_id: users[i]._id});
          const user = {
              user: {
                  uname: userD.username,
              },
              name: users[i].name,
              phone: users[i].phone,
              mobile: users[i].mobile,
              email: users[i].email,
              address: users[i].address,
              image: users[i].image,
          };
          userDetails.push(user);
      }
      res.render('viewUsers', {usersDatas: userDetails});
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  router.get("/getallpets", authenticateUser,async (req, res) => {
    Pets.find({})
    .then((result) => {
      res.render("viewPets", { pets: result });
    })
    .catch((error) => {
      console.error(error);
    });
  });
 

  router.route('/delete-pet/:id').get( async (req, res) => {
    try {
      const pet = await Pets.findById(req.params.id);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
  
      // await Pets.deleteOne({ _id: req.body.id });
      pet.displayFlag = "false";
      await pet.save();
      res.redirect("/admin/getallpets")
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.post("/successBooking/:id", async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      const pet = await Pets.findById(booking.pet._id);
      pet.bookedFlag = true;
      pet.displayFlag = false;
      await pet.save();
  
      await Booking.findByIdAndDelete(req.body.bookingId);
     
  
      res.redirect("/admin/bookings")
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });
  router.post("/removeBooking/:id", async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      const pet = await Pets.findById(booking.pet._id);
      pet.bookedFlag = false;
      pet.displayFlag = true;
      await pet.save();
  
      await Booking.findByIdAndDelete(req.body.bookingId);
      res.redirect("/admin/bookings")
    } catch (err) {
      const booking = await Booking.findById(req.body.bookingId);
      const pet = await Pets.findById(booking.pet._id);
      console.log(pet);
      pet.bookedFlag = true;
      await pet.save();
      res.status(500).json({ message: "Booking deletion failed" });
    }
  });
module.exports = router;
