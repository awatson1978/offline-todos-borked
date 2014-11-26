// Google has a separate feed for contacts and groups.
// Note: not using var because we want this to be global
// UserSettings and Messages for each group (tied by group_id).
Contacts = new Meteor.Collection("contacts");
Contacts.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

// NOTE FROM ABBY:  I'm not sure if UserSettings is needed
// I suspect Meteor.user().profile is sufficient for anything you want here
UserSettings = new Meteor.Collection("usersettings");
UserSettings.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});


Messages = new Meteor.Collection("messages");
Messages.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

UserLogs = new Meteor.Collection("userlogs");
UserLogs.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

Groups = new Meteor.Collection("groups");
Groups.allow({
  insert: function(){
    return true;
  },
  //upsert: function(){
  //  return true;
  //},
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
