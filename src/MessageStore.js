var Reflux = require('reflux');
var objectAssign = require('object-assign');

var MessageActions = require('./MessageActions');

var isString = require('./utils/isString');

var _stack = []; // Container for the each object of message
var _counter = 0;

/**
 * Registry of all messages, mixin to manage all drawers.
 * Contains add, flush, and remove to do the mentioned.
 */
var MessageStore = Reflux.createStore({
  listenables: MessageActions,

  /**
   * Adds a new message to the stack
   */
  onAdd: function(data) {
    // Message defaults
    var _defaults = {
      id: ++_counter,
      duration: 10000,
      data: ''
    };

    _stack.push( data
      ? objectAssign(_defaults, isString(data) ? { data: data } : data )
      : _defaults
    );

    this.trigger(_stack);
  },
  
  /**
   * Removes the message with given key
   * @param {int} id ID/Key of message which would be removed
   */
  onRemove: function(id) {
    // Index of the message
    var index = _stack.map(function(message) { return message.id }).indexOf(id);

    // Throw an exception if there are no results of the given id
    if ( index == -1 ) {
      var err = 'The message (id) does not exist in the stack';
      throw new Error(err);
    }
    
    _stack.splice(index, 1);
    this.trigger(_stack);
  },

  /**
   * Removes everything in the stack. If a filter is provided,
   * removes only messages with that type.
   *
   * @param {string} f Message type to be cleared
   */
  onClear: function(f) {
    this.trigger(_stack = !!f && f !== null
      ? _stack.filter(function(m) { return m.type ? m.type !== f : true })
      : []
    );
  },

  /**
   * Similar to `onClear`, but, if a filter is provided,
   * removes all messages in the stack except messages with that type
   * e.g., passing 'toast' ```(clearExcept('toast')) would
   * clear everything else and leave messages with `toast` alone.
   *
   * I doubt this would get used, but ~wallah~, here it is.
   *
   * @param {string} f Message type to be cleared
   */
  onClearExcept: function(f) {
    this.trigger(_stack = !!f
      ? _stack.filter(function(m) { return m.type ? m.type !== f : false })
      : []
    );
  }
};

module.exports = MessageStore;
