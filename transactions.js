module.exports = function () {
    var express = require('express');
    var router = express.Router();

    function getTransactions(res, mysql, context, complete) {
        mysql.pool.query("SELECT * FROM transaction_table", function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.trasnsactions = results;
            complete();
        });
    }


    function getTransactionSuppliesByCname(res, mysql, context, complete) {
        var query = "SELECT purchase_table.tid, transaction_table.cname, supply_table.bname, animal_table.type FROM purchase_table INNER JOIN transaction_table ON purchase_table.tid = transaction_table.id INNER JOIN supply_table ON purchase_table.sid = supply_table.id WHERE transaction_table.cname=?";
        console.log(req.params)
        var inserts = [req.params.transactionSupply]
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.transaction = results;
            complete();
        });
    }

    function getTransactionAnimalsByCname(res, mysql, context, complete) {
        var query = "SELECT adoption_table.tid, transaction_table.cname, animal_table.type FROM adoption_table INNER JOIN transaction_table ON adoption_table.tid = transaction_table.id INNER JOIN animal_table ON adoption_table.aid = animal_table.id WHERE transaction_table.cname= :namefromsearchinput";
        console.log(req.params)
        var inserts = [req.params.transactionAnimal]
        mysql.pool.query(query, inserts, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.transaction = results;
            complete();
        });
    }

    /*add new animal transaction*/

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = []; //"deleteperson.js","filterpeople.js","searchpeople.js"
        var mysql = req.app.get('mysql');
        getTransactions(res, mysql, context, complete);
        /*getTransactionSuppliesByCname(res, mysql, context, complete);
        getTransactionAnimalsByCname(res, mysql, context, complete);*/
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('transactions', context);
            }
        }
    });
    router.post('/', function (req, res) {
        //console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO transaction_table (cname) VALUES (?); INSERT INTO adoption_table (tid, aid) VALUES (LAST_INSERT_ID(), ?) ";
        var inserts = [req.cname, req.aid];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
        });
    });

    //addnew supply transaction
    router.post('/', function (req, res) {
        //console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO transaction_table (cname) VALUES (?); INSERT INTO adoption_table (tid, sid) VALUES (LAST_INSERT_ID(), ?) ";
        var inserts = [req.cname, req.sid];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
        });
    });

    //delete transaction
    /*-- customer is returning an item (deleting item that was purchased)
    -- given tid cname bname
    DELETE FROM purchase_table
    WHERE tid= :tidfrominput
    AND sid=(
      SELECT supply_table.id
      FROM supply_table
      WHERE supply_table.bname LIKE %:supplybnamefrominput%);*/


    router.delete('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM purchase_table WHERE tid= ? AND sid= SELECT supply_table.id FROM supply_table WHERE supply_table.bname = %);";
        var inserts = [req.params.tid, req.params.bname];
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
