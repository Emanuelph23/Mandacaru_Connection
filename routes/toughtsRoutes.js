const express = require('express');
const router = express.Router();
const ToughtController = require('../controllers/ToughtController');

//Hellpers
const checkAuth = require('../helpers/auth').checkAuth;

//Controllers

router.get('/', ToughtController.showHome);
router.get('/posts',checkAuth, ToughtController.Posts);
router.post('/delete/post',checkAuth, ToughtController.deletePost);
router.get('/edit/post/:id',checkAuth, ToughtController.editPost);
router.post('/edit/post',checkAuth, ToughtController.saveEditPost);
router.get('/perfil',checkAuth, ToughtController.myPosts);
router.get('/addPost', checkAuth,ToughtController.showAddPost);
router.post('/addPost', checkAuth,ToughtController.addPost);

module.exports = router;