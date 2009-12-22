/*
 * imgtray experimental visual image database
 * Copyright (c) 2009 a2h - http://a2h.uni.cc/
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * Under section 7b of the GNU Affero General Public License you are
 * required to preserve this notice.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Please note that images in the 'img/btn' folder are NOT licensed under this.
 *
 */

///
/// TOOLBAR
///

$(document).ready(function() {
	$(".toolbar_btn .content").css({'display':'none'});
	$(".toolbar_btn").find("img:first").click(function() {
		$(".toolbar_btn .content").each(function() {
			if ($(this).css('display') != 'none')
			{
				$(this).animate({'width':'toggle'});
			}
		});
		$(this).parent().find(".content").stop().animate({'width':'toggle'});
	});
	
	$("#toolbar_add_go").click(function() {
		imageAdd($("#toolbar_add_url").attr('value'), $("#toolbar_add_width").attr('value'));
	});
});

///
/// IMAGE MANAGEMENT
///

var imgbuttons = '<div class="btns"><img src="img/btn/edit.png" alt="edit" /> <img src="img/btn/info.png" alt="info" /></div>';
var imghandles = '<div class="rothandles"><div class="tl"></div><div class="tr"></div><div class="bl"></div><div class="br"></div></div>';

function imageAdd(href,imgwidth)
{
	if (isNaN(parseInt(imgwidth)))
	{
		imgwidth = 256;
	}
	
	$('<div class="img drag"></div>')
		.css({ width: imgwidth+'px', margin: '0px auto' })
		.append('<img class="imgimg" src="' + href + '" style="width:' + imgwidth + 'px;" alt="" />')
		.append('<div class="info"><div class="name">asdf</div>' + imgbuttons + '<div class="clear"></div></div>')
		.append(imghandles)
		.appendTo("#area")
		.imageRotAdd();
}

///
/// IMAGE ROTATION
///

var mouseX   = 0;
var mouseY   = 0;
var mouseRot = false;
var mouseAng = 0;
var mouseAngOld = 0;
var mouseTrg = {x:0,y:0};
var elmCenter = [];

$(document).ready(function() {
	var mouseElm;
	
	$().mousemove(function(e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
		
		if (mouseRot)
		{						
			// get the mouse's angle and the element's current angle - add 90 because the maths works differently from CSS3 transform
			mouseAng = Math.atan( ( mouseY - mouseTrg.y ) / ( mouseX - mouseTrg.x ) ) / ( 2 * Math.PI ) * 360 + 90;
			mouseAngElm = parseFloat($(mouseElm).css('transform').replace('rotate(','').replace('deg)',''));
			
			// stuff to help me think
			/*if (mouseAng > mouseAngOld) { $("#test").text('new val is larger'); }
			if (mouseAng < mouseAngOld) { $("#test").text('new val is smaller'); }*/
			
			// get the offset, but if it's a jump ignore it
			mouseOff = mouseAng-mouseAngOld;
			if (mouseOff > 90) { mouseOff = 0; }
			if (mouseOff < -90) { mouseOff = 0; }
			
			// get the new angle value
			result = mouseAngElm+mouseOff;
			
			if (result > 360)
			{
				do
				{
					result -= 360;
				}
				while (result > 360)
			}
			else if (result < 0)
			{
				do
				{
					result += 360;
				}
				while (result < 360)
			}
			
			// more stuff to help me think
			//$("#test").text(result);
			
			// go forth my beautiful code, attack the angle of the dastardly element!
			$(mouseElm).css('transform','rotate('+result+'deg)');
			$(mouseElm).find(".rothandles div").css('transform','rotate('+result+'deg)');
			
			// we shall meet again... next time...
			mouseAngOld = mouseAng;
		}
	});
	
	$.fn.imageRotAdd = function()
	{
		$(this).jqDrag($(this).find(".imgimg"));
		
		$(this).find(".rothandles .tl").css({left:-24,top:-24}).bind('mousedown',imageRot);
		$(this).find(".rothandles .tr").css({left:$(this).width()+16,top:-24}).bind('mousedown',imageRot);
		$(this).find(".rothandles .bl").css({left:-24,top:$(this).height()+16}).bind('mousedown',imageRot);
		$(this).find(".rothandles .br").css({left:$(this).width()+16,top:$(this).height()+16}).bind('mousedown',imageRot);
		
		$(this).css('transform','rotate(0deg)');
		
		return this;
	}
	
	function imageRot()
	{
		$().bind('mouseup',function() {
			// stop rotation, obviously
			mouseRot = false;
			// return the mouse to its original state
			$("body").css('cursor','auto');
		});
		
		// give the mouse its appropriate image
		switch ($(this).attr('class'))
		{
			case 'tl': $("body").css('cursor','url("img/cur/tl.png"), sw-resize'); break;
			case 'tr': $("body").css('cursor','url("img/cur/tr.png"), se-resize'); break;
			case 'bl': $("body").css('cursor','url("img/cur/bl.png"), nw-resize'); break;
			case 'br': $("body").css('cursor','url("img/cur/br.png"), ne-resize'); break;
		}
		
		// get the centre of the element
		var box = $(this).parent().parent();
		var offset = box.offset();
		mouseTrg = { x: (offset.left + (box.width()/2)), y: (offset.top + (box.height()/2)) };
		mouseRot = true;
		mouseElm = box;
		
		// the user obviously shouldn't be able to drag the handle
		return false;
	}
});