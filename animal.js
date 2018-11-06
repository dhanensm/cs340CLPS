/*ANIMAL PAGE*/

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //displays all animals???
    function getAnimal(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM animal_table", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal = results;
            complete();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = []; //"deleteperson.js","filterpeople.js","searchpeople.js"
        var mysql = req.app.get('mysql');
        getAnimal(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('animal', context);
            }
        }
    });

    /*delee an animal*/
    //    DELETE FROM animal_table WHERE id= :animalIdSelectedInBrowser;
    router.delete('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM animal_table WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        })
    })

    return router;
}();
