Session.setDefault("contactsSearchFilter", "");


Template.contactsListPage.helpers({
  getContactSearchFilter: function() {
    return Session.get('contactsSearchFilter');
  },
  noContacts: function() {
    var count = Contacts.find({
      //groupId: Session.get("selectedGroupId"),
      name: {
        $regex: Session.get('contactsSearchFilter'),
        $options: 'i'
      }
    }).count();
    if (count === 0) {
      return true;
    } else {
      return false;
    }
  },
  contacts: function() {
    console.log("selectedGroupId", Session.get("selectedGroupId"));
    return Contacts.find({
      //groupId: Session.get("selectedGroupId"),

      name: {
        $regex: Session.get('contactsSearchFilter'),
        $options: 'i'
      }
    }, {
      sort: {
        name: 1
      }
    });
  }
});


Template.contactsListPage.events({
  "keyup #contactSearchInput": function(event, template) {
    Session.set('contactsSearchFilter', $('#contactSearchInput').val());
  },
  "click .contactListItem": function() {
    if (Session.get('isModal')) {
      //Groups.update({_id: Session.get('selectedGroupId')}, {$addToSet:{
      Groups.update({
        _id: Session.get('selectedGroupId')
      }, {
        $addToSet: {
          contacts: {
            _id: this._id,
            name: this.name
          }
        }
      });
      Session.set('isModal', false);
      Router.go('/edit/group/' + Session.get('selectedGroupId'));
    } else {
      Session.set('selectedContactId', this._id);
      Router.go('/edit/contact/' + this._id);
    }
  }
});
