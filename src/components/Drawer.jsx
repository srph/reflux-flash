/** @jsx React.DOM */
var React = require('react');
var Reflux = require('reflux');

var MessageActions = require('../MessageActions');
var MessageStore = require('../MessageStore');
var Message = require('./components/Message.jsx');


/**
 * More like a category of messages,
 * or a container of messages of certain type
 */
var Drawer = React.createClass({
  mixins: [Reflux.connectFilter(MessageStore, 'stack', function(stack) {
    var filter = this.props.filter;
    
    return stack.filter(function(message, index) {
      return filter ? message.type == filter : true;
    });
  })],

  propTypes: {
    /**
     * Type of message to be filtered, filter == message.type
     */
    filter: React.PropTypes.string,
    
    /**
     * Limit of messages to show
     */
    limit: React.PropTypes.number,
    
    /**
     * Custom template instead of the provided `Message` component
     */
    template: React.PropTypes.element
  },
  
  /**
   * `stack` - The messages
   */
  getInitialState: function() { return { stack: [] } },
  
  render: function() {
    // Props shorthand
    var stack = this.state.stack;
    var removeHandler = this._removeHandler;
    
    // Message template
    var Message = this.props.template || Message;

    return (
      <div {...this.props}>
        {stack.map(function(message, index) {
          return <Message data={message} key={index} removeHandler={removeHandler} />
        })}
      </div>
    );
  },

  /**
   * @see MessageActions.remove
   * @param {int} id ID to pass to Manager.remove / Message to remove
   */
  _removeHandler: function(id) { MessageActions.remove(id); }
});

module.exports = Drawer;
