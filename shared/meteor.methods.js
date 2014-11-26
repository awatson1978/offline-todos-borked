// The current model is to not sync contacts with 3rd parties.
// Import contacts for updates.
// Do we want to sync with 3rd parties?
// Need to work on the parameters sent and the callback
// The user should be able to enter the new group in the select drop-down form
Meteor.methods({
  'addGroup': function(groupTitle) {
    var currentUserId = Meteor.userId();
    Groups.insert({
      title: groupTitle,
      groupId: this._id,
      createdBy: currentUserId,
      groupSource: "Jugglenut"
    });
  },
  'removeGroup': function(groupTitle) {
    var currentUserId = Meteor.userId();
    Groups.remove(groupTitle);
  },

  // Get session selected groupId
  'addContact': function(contactFirstName, contactLastName, contactEmail, contactPhone, selectedGroupId, selectedGroupSource) {
    var currentUserId = Meteor.userId();
    Contacts.insert({
      firstName: contactFirstName,
      lastName: contactLastName,
      email: contactEmail,
      phone: contactPhone,
      groupId: selectedGroupId,
      createdBy: currentUserId,
      groupSource: selectedGroupSource
    });
  },
  // TODO: google contacts API
  'importContacts': function() {
    console.log("importing contacts");
  },

  // TODO: make sure only contacts created by currentUserId can be add/removed
  'removeContact': function(selectedContact) {
    var currentUserId = Meteor.userId();
    Contacts.remove(selectedContact);
  },

  'httpcall': function(userId) {
    // var accessToken = users.services.google.accessToken;
    var accessToken = "ya29.gwDvSD5OmLHj1WWRpVvEoBLgs1gfLnS45fmyBdEqACx3g3EsDHCxSOfp";

    var result = HTTP.call("POST", "https://www.google.com/m8/feeds/contacts/default/full?alt=json", {
      params: {
        access_token: accessToken
      }
    });
    if (result.error)
      throw result.error;

    console.log("got the data: " + result.data);
    console.log("in Json: " + JSON.stringify(result));
  }
});
