
//Deps.autorun(function(){
  // if(Meteor.userId()){
  //   Meteor.subscribe('todos', Meteor.userId());
  // }else{
  //   Meteor.subscribe('todos', false);
  // }
//});
Meteor.subscribe("groups");
Meteor.subscribe("contacts");
Meteor.subscribe("messages");
