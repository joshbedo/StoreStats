var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient){
	db = mongoClient.db("storeStats");
	db.collection('customers', {strict:true}, function(err, collection){
		if(err){
			console.log('The "Customers" collection does\'t exist');
		}
	})
});

//find all customers
exports.findAll = function(req, res){
	//var name = req.query["first_name"];
	db.collection('customers', function(err, collection){
		collection.find().toArray(function(err, items){
			res.jsonp(items);
		})
	})
};

//find by id
exports.findById = function(col){
	return function(req, res){
		var id = parseInt(req.params.id);
		db.collection(col, function(err, collection){
			collection.findOne({'id': id}, function(err, item){
				res.jsonp(item);
			})
		});
	}
};
