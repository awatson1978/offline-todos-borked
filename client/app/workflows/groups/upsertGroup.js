Session.setDefault('isModal', false);

//==============================================================================
// TEMPLATE OUTPUTS

Template.upsertGroupPage.helpers({
  contacts: function () {
    if(Session.get('selectedGroupId')){
      var group = Groups.findOne(Session.get('selectedGroupId'));
      if(group.contacts){
        return group.contacts;
      }else{
        return [];
      }
    }else{
      return [];
    }
  },
  group: function () {
    if(Session.get('selectedGroupId')){
      return Groups.findOne(Session.get('selectedGroupId'));
    }else{
      return {};
    }
  },
  getUpsertGroupTitle: function(){
    if(Session.get('selectedGroupId')){
      return "Edit Group " + Session.get('selectedGroupId');
    }else{
      return "New Group";
    }
  }
});

//==============================================================================
// TEMPLATE INPUTS
// TODO: remove description or change it
// TODO: change _id from contacts to groupId?
Template.upsertGroupPage.events({
  'click .danger': function () {
    Groups.update({_id: Session.get('selectedGroupId')},{$pull:{
      contacts: {_id: this._id, name: this.name}
    }});
  },
  'click .list-group-item': function (event, template) {
    $('#' + this._id).toggleClass('open');
  }
});
