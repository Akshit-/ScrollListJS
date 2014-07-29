var ItemLister = function( options) {
	
	var that = this;	
	this.id = options.id;
	this.getItemView = options.getItemView;

	this.data = options.data || [];
				
	window.addEventListener('load', function() {
		that.init();
		
	});
	
};

ItemLister.prototype.init = function() {
	
	var d = document,
		w = window,
		event = 'scroll',
		that = this;
	
	
	this.div = document.getElementById( this.id);
		
	//showing the first items
	var count = that.data.length;
	
	for ( x = 0; x < this.range.max && x < count; x++)
		that._initializeItemListView( x);
	
	that.range.end = x;


	//adding mouse events
	if ( w.onmousewheel !== "undefined")
		event = 'mousewheel';
	else if (w.wheel !== "undefined")
		event = 'wheel';
	

	w.addEventListener( event, function( evt) {
		
		that.scrollListener( evt);
		
	});
	
	//adding DOMMouseScroll event for firefox
	var isFirefox = (navigator.userAgent.indexOf("Gecko") !== -1);


	// Firefox only
	if (isFirefox){                     
        	w.addEventListener("DOMMouseScroll", function(evt){
		
				that.scrollListener(evt);
		
			},false);
	}

};

ItemLister.prototype.scrollListener = function( event) {
	
	var doc = document.documentElement,
		body = document.body,
		dY = event.wheelDeltaY,
		pageY = (doc && doc.scrollTop || body && body.scrollTop  || 0),
		bottomPosition = this.div.offsetHeight,

		pageHeight = window.innerHeight;
		itemList = this;
	
	if ( dY > 0) { 
		// UP scrolling
		console.log('scroll up');
		
		if ( pageHeight > pageY ) {
			
			itemList._addInTop();
			
		}
		
		if ( bottomPosition > pageY + pageHeight) {
			
			itemList._removeFromBottom();
			
		}

		
	} else { 

		// DOWN scrolling
		console.log('scroll down');

		if ( bottomPosition - pageHeight > pageY) {
			
			itemList._removeFromTop();
			
		}

		if ( bottomPosition - pageHeight < pageY ) {
			
			itemList._addInBottom();
			
		}
				

	}
	
};


ItemLister.prototype._removeFromTop = function() {
	
	var topItem = this.div.childNodes[ 0];


	if ( this.range.length() >= this.range.max) {

		var ele = this.div.removeChild( topItem);

		this.range.start++;
			
	}
	
};


ItemLister.prototype._addInBottom = function() {
	
	var totalItems = this.data.length,
		rangeEnd = this.range.end,
		itemT;
	
		if ( rangeEnd + 1 < totalItems ) {
			
			this.range.end += 1;

			itemT = this._getItemListView( rangeEnd + 1 );
			itemT.className += ' bottom';
			this.div.appendChild( itemT);

		}
	
};


ItemLister.prototype._removeFromBottom = function() {
	
	var list = this.div,
		bottomElem = list.lastChild,
		elemHeight = bottomElem.offsetHeight;
		

	var ele = list.removeChild( bottomElem);

	this.range.end--;
	
};

ItemLister.prototype._addInTop = function() {
	
	var count = this.data.length,
		topItem = this.div.childNodes[ 0];
	
	if ( this.range.start - 1 >= 0 ) {
		
		this.range.start--;
		var newItem = this._getItemListView(this.range.start);
		
		newItem.className += ' top';
		
		this.div.insertBefore( newItem, topItem);
				
	}
	
};


ItemLister.prototype._initializeItemListView = function( index) {
	
	this.div.appendChild( this._getItemListView( index));
	
};

ItemLister.prototype._getItemListView = function( index) {
	
	return this.getItemView(index);
	
};

/*
When a JavaScript date has gone bad, 
"Don't call me, I'll callback you. I promise!"
*/

ItemLister.prototype.range = {
	max: 10,
	start: 0,
	end: 0,
	length: function() {
		
		return this.end - this.start;
		
	}
};
