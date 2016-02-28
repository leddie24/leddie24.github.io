var Note = React.createClass({displayName: "Note",
   render: function() {
      return (
         React.createElement("div", {className: "note"}, 
            React.createElement("p", null, this.props.note), 
            React.createElement("div", {className: "actions"}, 
               React.createElement("button", {className: "btn btn-sm glyphicon glyphicon-pencil"}), 
               React.createElement("button", {className: "btn btn-sm glyphicon glyphicon-remove-sign"})
            )
         ))
   }
});