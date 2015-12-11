var alsoResizeChildren = require('./alsoResizeChildren');
var generateNames = require('./generateNamesArr');
var replaceNameWithInputField = require('./replaceNameWithInputField');

//creates a new box div and appends it to the parent node (context). Sets the box to be resizable and draggable. Applies default CSS for dynamic resizing of boxes inside child boxes.
module.exports = function (boxName, node, fromLoadButton) {
  var context = fromLoadButton ? $('#' + node.parent) : $('#overReact-container');
  
  //To append parent name to box
  var contextName = context.attr('id')
  if(contextName === 'overReact-container') contextName = 'App'

  //create and append box
  $('<div class="box"><div>').attr('id', boxName)
    .append(`<span>${boxName}</span><p class='parentName'> nested in: ${contextName}</p>`)
    .appendTo(context)
    .draggable({
      containment: '#overReact-container'
    })
    .resizable({
      containment: 'parent',
    })
    .droppable({
      // greedy: true,
      accept: '.box',
      hoverClass: 'ui-state-hover',
      tolerance: 'fit',
      drop: function( e, ui ) {
        var droppedInto = $(this);
        //if dropping into same div, return out
        if(droppedInto.attr('id') === ui.draggable.parent()[0].id) return;
        //adjust the css on drop
        $(ui.draggable).css({
          top: ui.draggable.offset().top - droppedInto.offset().top,
          left: ui.draggable.offset().left - droppedInto.offset().left
        });
        //append the div that is being dragged into the div that will be its parent
        ui.draggable.appendTo(droppedInto);
        //re-set all divs resizable to also resize their children
        alsoResizeChildren($('#overReact-container')); 
        //change parent name of "nested in: "      
        var parentName = ('box parent: ', droppedInto.attr('id'));
        if(parentName === 'overReact-container') parentName = 'App';        
        $(ui.draggable).children('p:first-of-type').text('nested in: ' + parentName)
        return;
      }
    });

    //if the new box is not a direct child of the main overReact-container, set its parent resizable to resize all of the children for that parent

  //initial styling

  if (fromLoadButton) {
    $('#' + boxName).attr('style', node.style);
  } else {
      if (generateNames().names.length !== 0) {

        var boxPos = {
          height: 75,
          width: 150,
          top: generateNames().lowestElem.position.top + 30
        };

        if (generateNames().lowestElem.distToBottom < 100) {
          boxPos.top = 30
        }

        $('#' + boxName).css(boxPos);

      } else {
        $('#' + boxName).css({
          height: 75,
          width: 300,
          top: 30
        });
      }
  }
  $('#' + boxName).find('span').on('dblclick', function(e) {
    e.preventDefault();
    replaceNameWithInputField(boxName);
  });
};
