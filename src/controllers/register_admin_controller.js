
const { register_admin_service } = require("../services/register_admin_service");
const {dashboard_service} = require('../services/dashboard_service')


exports.register_admin = async (req, res) => {
    res.render('register_admin');
}

exports.register_admin_data = async (req, res) => {
    try {
        let data = await register_admin_service(req,res);
        if(data.success){
        res.redirect("login_admin");
    

        }
        else{
            console.log("Error in register_admin_service");
        }
    }catch(error){
        console.log(error);
    }
}