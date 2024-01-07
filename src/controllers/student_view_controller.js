const {view_student} = require('../services/view_student_service');
const { userprofile } = require("../services/users_profile_service");

exports.view_student = async (req, res) => {
    let data = await view_student(req,res);
    let dataadmin = await userprofile(req, res);


    if(data.success){

        console.log("datadsdsds",data.data);
        // res.send("hi")
        res.render('view_student', { data: data.data ,
            Dataad: dataadmin.data });
    }else{
        res.send("Error Happened");
    }
}