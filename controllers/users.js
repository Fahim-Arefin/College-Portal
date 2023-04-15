const User = require('../models/user')

module.exports.welcomePage = (req,res)=>{
    res.render('users/welcome')
}

module.exports.loginPage = (req,res)=>{
    res.render('users/login')
}

module.exports.dashboard = (req,res)=>{
    res.render('users/dashboard')
}

module.exports.login = (req, res) => {
    if(req.user.tag==='faculty'){
        req.flash('success', `Welcome Back ${req.user.username} (sir) to our Collecge Portal`)
    }
    if(req.user.tag==='student'){
        req.flash('success', `Welcome Back ${req.user.username} (student) into Collecge Portal`)
    }
    if(req.user.tag==='guardian'){
        req.flash('success', `Welcome Back ${req.user.username} (parent) inside College Portal`)
    }
    
    res.redirect('/dashboard')
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {       //passport provide it see doc
        if (err) {
            return next(err)
        }
        req.flash('success', 'GoodBye!')
        res.redirect('/login')
    })
}