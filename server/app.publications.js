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


Meteor.publish('todos', function() {
  if(this.userId){
    return Todos.find({$or:[
      {ownerId: this.userId},
      {public: true}
      ]});
    }else{
      return Todos.find({public: true});
    }
  });


  Meteor.publish('user', function() {
  return Meteor.users.find(this.userId);
});
Meteor.publish('groups', function() {
  return Groups.find({}, {
    sort: {
      title: -1
    }
  });
});
Meteor.publish('contacts', function() {
  return Contacts.find();
});
Meteor.publish('messages', function() {
  return Messages.find({}, {
    sort: {
      subject: -1,
      body: -1,
      queue: -1
    }
  });
});
