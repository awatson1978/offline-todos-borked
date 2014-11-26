var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);



//==============================================================================
// TEMPLATE CONSTRUCTORS

Template.appBody.rendered = function() {
  if (Meteor.isCordova) {
    // set up a swipe left / right handler
    this.hammer = new Hammer(this.find('#appBody'));
    this.hammer.on('swipeleft swiperight', function(event) {
      if (event.gesture.direction === 'right') {
        Session.set(MENU_KEY, true);
      } else if (event.gesture.direction === 'left') {
        Session.set(MENU_KEY, false);
      }
    });
  }

  this.find('#contentContainer')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    }
    // removeElement: function(node) {
    //   $(node).fadeOut(function() {
    //     this.remove();
    //   });
    // }
  };
};



Template.appBody.destroyed = function() {
  if (Meteor.isCordova) {
    this.hammer.destroy();
  }
};

//==============================================================================
// TEMPLATE FOOTER CONTROLS

Template.registerHelper("hasGroupControls", function(argument) {
  if (Router.current()) {
    if (/groups/.test(Router.current().url)) {
      return true;
    } else {
      return false;
    }
  }
});
Template.registerHelper("hasGroupUpsertControls", function(argument) {
  if (Router.current()) {
    if (/new\/group/.test(Router.current().url)) {
      return true;
    } else if (/edit\/group/.test(Router.current().url)) {
      return true;
    } else {
      return false;
    }
  }
});
Template.registerHelper("hasContactControls", function(argument) {
  if (Router.current()) {
    if (/contacts/.test(Router.current().url)) {
      return true;
    } else {
      return false;
    }
  }
});
Template.registerHelper("hasContactUpsertControls", function(argument) {
  if (Router.current()) {
    if (/new\/contact/.test(Router.current().url)) {
      return true;
    } else if (/edit\/contact/.test(Router.current().url)) {
      return true;
    } else {
      return false;
    }
  }
});


//==============================================================================
// TEMPLATE OUTPUTS

Template.appBody.helpers({
  getProfileName: function () {
    console.log('Meteor.userId()', Meteor.userId());

    var user = Meteor.users.findOne(Meteor.userId());
    if(user){
      if(user && user.profile){
        if(user && user.profile && user.profile.name){
          return user.profile.name;

        }else{
          return "No user name.";
        }
      }else{
        return "No user profile.";
      }
    }else{
      return "No user object.";
    }
  },
  getConnectionStatus: function () {
    return Meteor.status().status;
  },
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes. #each looks at the _id property of it's
  // items to know when to insert a new item and when to update an old one.
  thisArray: function() {
    return [this];
  },
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  email: function() {
    return Meteor.user().emails[0].address;
  },
  userMenuOpen: function() {
    return Session.get(USER_MENU_KEY);
  },
  lists: function() {
    return Lists.find();
  },
  activeListClass: function() {
    var current = Router.current();
    if (current.route.name === 'todosListPage' && current.params._id === this._id) {
      return 'active';
    }
  },
  connected: function() {
    return Meteor.status().connected;
  }
});



//==============================================================================
// TEMPLATE INPUTS

Template.appBody.events({
  // ---------------------------------------------
  // Groups
  'click #clearGroup':function(){
    Session.set('selectedGroupId', null);
  },
  'click #upsertGroupButton':function(){
    Session.set('selectedGroupId', false);
    Router.go('/new/group')
  },
  'click #createGroupButton': function(event, template){
    var newGroup = {
      title: $('#groupTitleInput').val(),
      description: $('#groupDescriptionInput').val(),
      createdAt: new Date(),
      active: true,
      groupId: Meteor.uuid()
    }
    //alert(EJSON.stringify(newGroup));
    Groups.insert(newGroup);
    Router.go('/groups');
  },
  'click #deleteGroupButton':function(){
    Groups.remove({_id: Session.get('selectedGroupId')});
    Router.go('/groups');
  },
  'click #addContactToGroupButton': function () {
    Session.toggle('isModal');
    Router.go('/contacts');
  },


  // ---------------------------------------------
  // Contacts
  'click #clearContact':function(){
    Session.set('selectedContactId', null);
    Session.set('contactsSearchFilter', "");
  },

  'click #upsertContactButton':function(){
    Session.set('selectedContactId', false);
    Router.go('/new/contact');
  },
  'click #createContactButton': function(event, template) {

    event.preventDefault();
    // grab values from our form and put them into a record
    var newContact = {
      name: $('#contactNameInput').val(),
      email: {
        primary: $('#contactEmailInput').val(),
      },
      groupId: [],
      active: true,
      createdAt: new Date()
    }

    newContact.groupId[0] = Session.get('selectedGroupId');
    // TODO: validate record

    // put record into collection
    Contacts.insert(newContact);

    // TODO: need to add contactPhoneInput
    // clear our form
    $('#contactNameInput').val("");
    $('#contactEmailInput').val("");
    Router.go('/contacts');
  },
  'click #deleteContactButton': function() {
    Contacts.remove({
      _id: Session.get('selectedContactId')
    });
    Router.go('/contacts');
  },

  // ---------------------------------------------
  // Other
  'click .contactsListButton':function(){
    Router.go('/contacts');
  },

  'click .js-menu': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .contentOverlay': function(event) {
    Session.set(MENU_KEY, false);
    event.preventDefault();
  },

  'click .js-user-menu': function(event) {
    Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

  'click #menu a': function() {
    Session.set(MENU_KEY, false);
  },

  'click .js-logout': function() {
    Meteor.logout();

    // if we are on a private list, we'll need to go to a public one
    var current = Router.current();
    if (current.route.name === 'todosListPage' && current.data().userId) {
      Router.go('todosListPage', Lists.findOne({userId: {$exists: false}}));
    }
  },

  'click .js-new-list': function() {
    var list = {name: Lists.defaultName(), incompleteCount: 0};
    list._id = Lists.insert(list);

    Router.go('todosListPage', list);
  }
});
