const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {

    static async register(req, res){
        res.render('auth/register');
    }

    static async createUser(req,res){

        const { name, email, password, confirmpassword } = req.body;

        //Password Match Validation
        if(password !== confirmpassword){
            req.flash('message', 'As senhas não conferem, tente novamente!');
            res.render('auth/register');

            return;
        }

        //Email Validation
        const emailExists = await User.findOne({ where: { email: email } });

        if(emailExists){
            req.flash('message', 'Este email já está cadastrado, tente novamente!');
            res.render('auth/register');

            return;
        }

        //Create Password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashPassword
        }

        try {

            //const createdUser = await User.create(user);
            await User.create(user);

            //Init Session
            req.session.userid = user.id;

            req.flash('message', 'Usuário cadastrado com sucesso!');

            req.session.save(() => {
                res.render('toughts/dashboard');
            });

        } catch (error) {
            console.log(error);
        }

    }

    static async login(req, res){
        res.render('auth/login');
    }

    static async logoutUser(req, res){

        req.session.destroy()
        res.redirect('/');

    }

    static async loginPost(req, res){

        const { email, password } = req.body;

        //Find User
        const user = await User.findOne({ where: { email: email } });

        if(!user){
            req.flash('message', 'Usuário não encontrado!');
            res.render('auth/login');

            return;
        }

        //Match Password
        const matchPassword = bcrypt.compareSync(password, user.password);

        if(!matchPassword){
            req.flash('message', 'Senha incorreta!');
            res.render('auth/login');

            return;
        }

        //Init Session
        req.session.userid = user.id;

        req.flash('message', 'Autenticação realizada com sucesso!');

        req.session.save(() => {
            res.render('toughts/dashboard');
        });

    }

}