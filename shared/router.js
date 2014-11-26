Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the pageNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'pageNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
      Meteor.subscribe('publicLists'),
      Meteor.subscribe('privateLists'),
      Meteor.subscribe('todos')
    ];
  }
});


Router.map(function() {
  this.route('entrySignUp');
  this.route('entrySignIn');

  this.route('todosListPage', {
    path: '/lists/:_id',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the items as they arrive
    onBeforeAction: function() {
      //this.todosHandle = Meteor.subscribe('todos');
      Session.set('selectedListId', this.params._id);
      this.next();
    }
    // data: function() {
    //   return Lists.findOne(this.params._id);
    // }
  });

  // this.route('home', {
  //   path: '/',
  //   action: function() {
  //     Router.go('todosListPage', Lists.findOne());
  //   }
  // });
});

Router.route('/', function(){
  this.render('configureProfile');
})

Router.route('/contacts', function(){
  this.render('displayContacts');
})
Router.route('/groups', function(){
  this.render('displayGroups');
})






if (Meteor.isClient) {
  //Router.onBeforeAction('loading', {except: ['entrySignUp', 'entrySignIn']});
  Router.onBeforeAction('dataNotFound', {except: ['entrySignUp', 'entrySignIn']});
}
