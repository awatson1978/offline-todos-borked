// Group name is now group title
Session.setDefault("groupsSearchFilter", "");


Template.displayGroups.helpers({
  getGroupSearchFilter: function () {
    return Session.get('groupsSearchFilter');
  },
  noGroups: function () {
    var count = Groups.find({
      title: {
        $regex: Session.get('groupsSearchFilter'),
        $options: 'i'
      }}, {sort: {title: 1}}).count();

    if(count === 0){
      return true;
    }else{
      return false;
    }
  },
  groups: function() {
    console.log("selectedGroupId", Session.get("selectedGroupId"));
    return Groups.find({
      title: {
        $regex: Session.get('groupsSearchFilter'),
        $options: 'i'
      }}, {sort: {title: 1}});
  }
});




Template.displayGroups.events({
  "keyup #groupSearchInput": function(event, template){
    Session.set('groupsSearchFilter', $('#groupSearchInput').val());
  },
  "click .groupListItem":function(){
    // Session.set('selectedGroupId', this._id);
      Session.set('selectedGroupId', this.groupId);
      console.log("groupId: ", this.groupId);
  },
  'click #clearGroup':function(){
    Session.set('selectedGroupId', null);
  },
  'click #upsertGroupButton':function(){
    Session.set('selectedGroupId', false)
  }
});
