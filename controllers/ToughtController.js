const Tought = require('../models/Tought');
const User = require('../models/User');

const { Op } = require("sequelize");

 module.exports = class ToughtsController {

    static async showHome( req,res ) {
        res.render('toughts/home');
    }

    static async Posts(req, res) {

        let search = '';

        if(req.query.search){
            search = req.query.search;
        }

        let order = 'DESC';

        if(req.query.order === 'Old'){
            order = 'ASC';
        } else {
            order = 'DESC';
        }

        const posts = await Tought.findAll(
            { 
                include: User,
                where: {
                    title: {[Op.like]: `%${search}%`},
                },
                order: [['createdAt', order]]
            }
        );

        const postsData = posts.map((post) => {

            const posters = post.dataValues;
            const userName = post.User ? post.User.name : 'Usuário desconhecido';

            const postDate = new Date(posters.createdAt);

            const monthNames = [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ];

            //Format date
            const dateFormat = `${postDate.getDate()} de ${monthNames[postDate.getMonth()]} de ${postDate.getFullYear()}`;

            return { ...posters, userName , dateFormat };
        });

        let postsQty = postsData.length;

        if(postsQty === 0){
            postsQty = false;
        }
    
        res.render('toughts/posts', { posts: postsData, search, postsQty});

    }

    static async myPosts( req,res ) {

        const userId = req.session.userid;

        const user = await User.findOne(
            {
                where: {id: userId},
                include: Tought,
                plain: true
            }
        
        );

        //Check if user exists
        if(!user){
            res.redirect('/login');
        }

        const userName = user.name;
        const userEmail = user.email;

        //Get all posts from user
        const postData = user.toughts.map((post) => {

            const postObject = post.dataValues;
            postObject.userName = userName; 

            return postObject;
        });

        let emptyToughts = false;

        if(postData.length == 0){
            emptyToughts = true;
        }

        res.render('toughts/perfilUser',{postData, userName, userEmail, emptyToughts});
    }

    static showAddPost( req,res ) {
        res.render('toughts/addPost');
    }

    static async addPost(req, res){

        const post = {
            title: req.body.title,
            description: req.body.description,
            UserId: req.session.userid
        }

        try {
            
            await Tought.create(post);

            req.flash('message', 'Publicação realizada com sucesso!');

            req.session.save( () => {
                res.redirect('/posts');
            })

        } catch (error) {
            console.log(error);
        }

    }

    static async deletePost(req,res){

        const id = req.body.id;
        const userid = req.session.userid;

        try {

            await Tought.destroy({where: {id: id, UserId: userid}})

            req.flash('message', 'Publicação deletada com sucesso!');

            req.session.save( () => {
                res.redirect('/perfil')
            })

        } catch (error) {
            console.log(error);
        }

    }

    static async editPost(req,res){

        const id = req.params.id;

        const post = await Tought.findOne({where: {id: id}, raw: true});

        res.render('toughts/editPost', {post});

    }

    static async saveEditPost(req,res){
        
        const id = req.body.id;

        const updatePost = {
            title: req.body.title,
            description: req.body.description
        }

        try {
            
            await Tought.update(updatePost, {where: {id: id}});

            req.flash('message', 'Publicação editada com sucesso!');

            req.session.save( () => {
                res.redirect('/perfil');
            });


        } catch (error) {
            console.log(error);
        }


    }
 };