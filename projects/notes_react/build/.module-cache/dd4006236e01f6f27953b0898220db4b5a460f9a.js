var Board = React.createClass({displayName: "Board",
   render: function() {
      return (
         React.createElement("div", null, 
            React.createElement(Note, {note: "hello"}), 
            React.createElement(Note, {note: "hello2"}), 
            React.createElement(Note, {note: "hello3"})
         )
      )
   }
});