var request  = require("request");
var express = require("express");
var router = express.Router();
var jwt   = require('jsonwebtoken');
var bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

    const formRecognizer = function(req,res){ 
        sourcelocalUrl = req.body.imageUrl;    
        var source = sourcelocalUrl
        var body = {"url":source};
        body = JSON.stringify(body);

        headers = {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '41e9e03c96ae4688812fb4b99705dbb5',
        }

        var options = {
            method: 'POST',
            baseUrl: 'https://systemintegrationfinalproject.cognitiveservices.azure.com/formrecognizer/v1.0-preview/prebuilt/receipt/',
            url: 'asyncBatchAnalyze',
            body: body,
            headers: headers
        }


                request(options,function(err,response,body){      
                    if(err) return console.log(err);     
                    operationUrl = response.headers['operation-location'];
                    let operationId = operationUrl.split("operations/")[1];
                    options.method = 'GET';
                    options.url = 'operations/'+operationId;
                    options.body = "";
                    (function loop() {
                        request(options, function(err,respons,body){
                            if(err) reject(err);                 
                            resBody = JSON.parse(body);
                            if(resBody['status'] == 'Succeeded'){   
                                return res.status(200).json(resBody); 
                            }else{
                                setTimeout(function(){
                                    loop();
                                },1000);
                            }
                        });
                    }());
                });

};

const verifyToken = function(req,res,next){//verifying the token obtained from the user.

    var headerVal = req.headers['authorization'];
    var token = headerVal.split(' ')[1];
    if(token === null) return res.sendStatus(404);

    jwt.verify(token,'myKey',function(err,req,res){
        if(err) return res.sendStatus(404);
        next();
    })

}

router.post("/formRecognizer",formRecognizer);

//...........................JWT.............................

/*router.post("/user/formRecognizer",verifyToken,formRecognizer);  //using the verifytoken middlware to generate the accesstoken. 

router.post('/signIn/formRecognizer',function(req,res){

    username = req.body.username;
    password = req.body.password;
    if(username==="akhil" && password==="enter"){
        var payLoad = {
            user: username,
    };

    var token = jwt.sign(payLoad,'myKey',{expiresIn:  "0.2h"})
    return res.json({accessToken: token});
}

});*/

module.exports = router;


    
            


