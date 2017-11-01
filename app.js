var express     = require('express'),
    bodyParser  = require('body-parser'),
    mongodb     = require('mongodb'),
    ObjectID    = mongodb.ObjectID,
    app         = express(),
    PROVIDERS_COLLECTION = 'providers',
    SPECIALTIES_COLLECTION = 'specialties',
    db;

mongodb.MongoClient.connect( 'mongodb://juanp:juanp@ds237735.mlab.com:37735/evercheck-test-juan-perez', function( err, database ){
  if( err ){
    console.log( err )
  }

  db = database;
  console.log( "Database connection ready" );

  app.listen(3000, function () {
    console.log('app listening on port 3000!');
  });

});

app.use( function( req, res, next ) {
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE" );
  res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  next();
} );

app.use( bodyParser.json() );

app.get( '/providers/', function( req, res ){
  db.collection(PROVIDERS_COLLECTION ).find( {} ).toArray( function ( err, docs ) {
    if ( err ) {
      handleError( res, err.message, 'Failed to get providers.' );
    } else {
      res.status( 200 ).json( docs );
    }
  } );
} );

app.get( '/providers/:id', function ( req, res ) {
  if (!(req.params.id) ){
    handleError( res, 'Invalid provider input', "Must provide a id", 400 )
  }
  db.collection( PROVIDERS_COLLECTION ).find( { _id: new ObjectID(req.params.id) } ).toArray( function ( err, doc ) {
    if ( err ) {
      handleError( res, err.message, 'Failed to get provider' );
    } else {
      res.status( 200 ).json( doc );
    }
  } );
} );

app.post('/providers/', function( req, res ){
  var newProvider = req.body;
    db.collection( PROVIDERS_COLLECTION ).insertOne(newProvider,
    function ( err, docs ) {
      if ( err ) {
        handleError( res, err.message, "Failed to create new providr");
      }else{
        res.status( 201 ).json( docs.ops[0] );
      }
    } );
});

app.put('/providers/:id', function( req, res ){
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection( PROVIDERS_COLLECTION ).updateOne( { _id: new ObjectID( req.params.id ) },
  { $set: updateDoc  },
  function ( err, doc ) {
    if ( err ) {
      handleError( res, err.message, "Failed update" )
    } else {
      res.status( 202 ).json( doc );
    }
  });
});

app.delete('/providers/:id', function( req, res ){
  db.collection( PROVIDERS_COLLECTION ).deleteOne({ _id: new ObjectID(req.params.id)  }, function ( err, result ) {
    if ( err ) {
      handleError( res, err.message, "Failed to delete" )
    } else {
      res.status( 204 ).json( result );
    }
  });
});