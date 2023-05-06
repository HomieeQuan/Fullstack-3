module.exports = function(app, passport, db) {
  const ObjectID = require('mongodb').ObjectID
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {

      let sneakers = [
        {shoeName: 'Top 3', price: '$400', src: 'img/top3.jpg'},
        {shoeName: 'Hyper Royal', price: '$380', src: 'img/hyperRoyal.jpg'},
        {shoeName: 'Lost and Found', price: '$430', src: 'img/lostFound.jpg'},
        {shoeName: 'Raging Bulls', price: '$220', src: 'img/ragingBull.jpg'},
        {shoeName: 'Space Jams', price: '$550', src: 'img/spaceJam.jpg'},
        {shoeName: 'Travis Scotts', price: '$2400', src: 'img/travisScott.jpg'},
        {shoeName: 'Off White Sail', price: '$1300', src: 'img/offWhiteSail.jpeg'},
        {shoeName: 'Off White UNC', price: '$1800', src: 'img/offWhiteUnc.jpg.tiff'},
        {shoeName: 'Nike low dunk Kentucky', price: '$200', src: 'img/Kentucky.tiff'},
        {shoeName: 'Black AirForces', price: 'Might rob you instead', src: 'img/blackAirForce.jpeg'}
      ];
    
      db.collection('shoes').find({userid: req.user._id}).toArray((err, wishShoes) => {
        if (err) return console.log(err)
        res.render('profile.ejs', {
          user: req.user,
          sneakers: sneakers,
          wishShoes: wishShoes
        })
      })
    });
    
    // message board routes ===============================================================
    
    app.post('/shoeList', (req, res) => {
      db.collection('shoes').insertOne({
        userid: req.user._id,
        shoeName: req.body.shoeName,
        price: req.body.price, 
        wishList: true
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.json({success: true})
      })
    })


    app.put('/shoeList', (req, res) => {
      console.log(req.body)
      db.collection('shoes')
      .findOneAndUpdate({userid: req.user._id, shoeName: req.body.shoeName, price: req.body.price }, {
        $set: {
          purchased: true
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
  
    
    
    
    
    
    

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

app.post('/shoeList', (req, res) => {
  db.collection('shoes').insertOne({
    shoeName: req.body.shoeName,
    price: req.body.price
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.json({success: true})
  })
})

   

    
    app.delete('/wishShoes', (req, res) => {
      db.collection('shoes').findOneAndDelete({_id: ObjectID(req.body.id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
