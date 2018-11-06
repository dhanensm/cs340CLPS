/*ANIMAL PAGE*/

module.exports = function(){
    var express = require('express');
    var router = express.Router();

//displays all animals???
    function getAnimals(res, mysql, context, complete){
      sql.poo.query("SELECT * FROM animal_table", function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.animals  = results;
          complete();
      });
    }

/*delee an animal*/
//    DELETE FROM animal_table WHERE id= :animalIdSelectedInBrowser;
router.delete('/:id', function(req, res){
      var mysql = req.app.get('mysql');
      var sql = "DELETE FROM animal_table WHERE id = ?";
      var inserts = [req.params.id];
      sql = mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.status(400);
              res.end();
          }else{
              res.status(202).end();
          }
      })
  })

  return router;
}();
