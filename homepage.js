//HOMEPAGE???
module.exports = function(){
    var express = require('express');
    var router = express.Router();

/*adds an animal???*/
router.post('/', function(req, res){
    console.log(req.body.location)
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO animal_table (name, type, age, color, location, Ftype, cost) VALUES (?, ?, ?, ?, ?, ?, ?)";
    var inserts = [req.body.name, req.body.type, req.body.age, req.body.color, req.body.location, req.body.Ftype, req.body.cost];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }
    });
});

//adds an aisle???
//INSERT INTO aisle_table (contains)
//VALUES (:containsInput);
router.post('/', function(req, res){
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO aisle_table (contains) VALUES (?)";
    var inserts = [req.body.contains];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        }
    });
});


return router;
}();
