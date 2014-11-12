Meteor.publish('publicLists', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

// Meteor.publish('todos', function(listId) {
//   check(listId, String);
//
//   return Todos.find({listId: listId});
// });

Meteor.publish('todos', function() {
  //check(userId, String);
  if(this.userId){
    return Todos.find({$or:[
      {ownerId: this.userId},
      {public: {$exists: true}}
      ]});
    // return Todos.find({listId: userId});
  }else{
    return Todos.find({public: {$exists: true}});
  }
});
