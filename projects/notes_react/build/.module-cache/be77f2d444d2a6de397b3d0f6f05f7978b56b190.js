var Note = React.createClass({displayName: "Note",
   render: function() {
      return (
         React.createElement("div", {className: "note"}, 
            React.createElement("p", null, this.props.note)
         ))
   }
});