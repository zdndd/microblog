var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

module.exports = function(app) {


  app.get('/microblog', function(req, res) {
    Post.get(null, function(err, posts) {
      if (err) {
      	console.error("index get microblog " + err);
        posts = [];
      }
      res.render('microblog', {
        title: '首页',
        posts: posts
      });
    });
  });



  app.get('/reg', checkNotLogin);
  app.get('/reg',function(req,res){
    res.render('reg', {
      layout: 'layout',
      title: '注册'
    });
  });

  app.post('/reg', checkNotLogin);
  app.post('/reg', function(req, res) {
  	//检验用户两次输入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
    	  req.flash('error', 'not same psd');
      	return res.redirect('/reg');
    }

    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
      name: req.body.username,
      password: password,
      email: req.body.email
    });

    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {
      if (user)
      	err = 'Username already exists.';
      if (err) {
      	req.flash('error', err);
        return res.redirect('/reg');
      }

      //如果不存在则新增用户
      newUser.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        req.session.user = newUser;
        req.flash('success', 'reg success');
        res.redirect('/microblog');
      });
    });
  });

  app.get('/login', checkNotLogin);
  app.get('/login', function(req, res){
    res.render('login',{
      layout: 'layout',
      title: '登录'
    }); 
  });

  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res){
    //生成密码的散列值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('base64');
    //检查用户是否存在
    User.get(req.body.username, function(err, user){
      if(err){
        console.error("flash : " + err);
      }
      if(!user){
        req.flash('error', '用户不存在!'); 
        return res.redirect('/login'); 
      }
      //检查密码是否一致
      if(user.password != password){
        req.flash('error', '密码错误!'); 
        return res.redirect('/login');
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      req.flash('success','登陆成功!');
      res.redirect('/microblog');
    });
  });

  app.get('/post', checkLogin);
  app.get('/post',function(req,res){
    res.render('post', {
      layout: 'layout',
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/post', checkLogin);
  app.post('/post', function(req, res){
      var currentUser = req.session.user,
          post = new Post(currentUser.name, req.body.post);

      post.save(function(err){
        if(err){
          req.flash('error', err); 
          return res.redirect('/microblog');
        }
        req.flash('success', '发布成功!');
        res.redirect('/u/' + currentUser.name);
      });
  });

  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res){
    req.session.user = null;
    req.flash('success','登出成功!');
    res.redirect('/microblog');
  });

  app.get('/u/:user', function(req, res) {
    User.get(req.params.user, function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/microblog');
      }
      
      Post.get(user.name, function(err, posts) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/microblog');
        }
        res.render('user', {
          title: user.name,
          posts: posts,
        });
      });
    });
  });
};

function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error','未登录!'); 
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录!'); 
    return res.redirect('/microblog');
  }
  next();
}