var Note = React.createClass({displayName: "Note",
   render: function() {
      return (
         React.createElement("div", null, 
            React.createElement("p", null, this.props.note)
         ))
   }
});