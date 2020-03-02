// buildnavbar.js
// Assumes the following files exist:
// ../css/fuse.js (Full text search module)
// ../css/jquery-2.2.2.min.js (Jquery library)
// ../css/navAccordion.js (Expand/collapse TOC module)
// ./searchindex.js (Index file with full text index, TOC content, and standard text strings)
// HTML page with <div id="#shell">


$(document).ready(function(){
// Set up options for fuse.js search index

	var options = {
		shouldSort: true,
		includeScore: true,
		tokenize: true,
		matchAllTokens: true,
		findAllMatches: false,
		threshold: 0.01,
//		location: 0,
//		distance: 10000,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		maxResults: 30,
		minSnippetLength: 80,
		keys: [{
			name: "title",
			weight: 0.7},
			{
			name: "content",
			weight: 0.3}
		]
	};
	var snippetLength = Math.max($("#shell").width()/5,options.minSnippetLength);
	var previousarrow="leftarrow";
	var nextarrow="rightarrow";
	var arrowbuttons="";
	var fuse = new Fuse(searchIndex, options);
// Build navbar and panels
	var tocpanel = "";
	var tocbutton = "";
	var shellcontent = $("#shell").html();
	if ($("#shell > nav > ul.map").length > 0) {
		tocbutton = '<a id="tocbutton_disabled" class="navicon">' + 
				    '<img src="../images/TOC_disabled.svg" alt="' + contents_button_alt +
					'" /></a>';
	} else {
		tocpanel = '<div id="tocpanel">' + tocdata + '</div>';
		
		tocbutton = '<a id="tocbutton" class="navicon">' + 
					'<img src="../images/TOC.svg" alt="' + contents_button_alt + 
					'" /></a>' +
				    '<a id="tocbutton_selected" class="navicon" style="display:none;">' + 
					'<img src="../images/TOC.svg" alt="' + contents_button_alt + 
					'" /></a>';
	}
	if ($("html").attr("dir") == "rtl") {
			previousarrow = "rightarrow";
			nextarrow = "leftarrow";
	}

	if (window.history.length > 1) {
		arrowbuttons = '<td id="previouslinkcell"><a href="javascript:history.back();">' +
					   '<img src="../images/' + previousarrow + '.svg" alt="' + back_button_alt +
					   '" /></a></td>' +
					   '<td id="nextlinkcell"><a href="javascript:history.forward();">' + 
					   '<img src="../images/' + nextarrow + '.svg" alt="' + forward_button_alt +
					   '" /></a></td>';
	} else {
		arrowbuttons = '<td id="previouslinkcell">' +
			   '<img src="../images/' + previousarrow + '_disabled.svg" alt="' + back_button_alt +
			   '" /></td>' +
			   '<td id="nextlinkcell">' + 
			   '<img src="../images/' + nextarrow + '_disabled.svg" alt="' + forward_button_alt +
			   '" /></td>';
	}
	$("body").html(
	    '<nav class="navbar">'+
		'<table><tr>'+
		'<td id="tocbuttoncell">'+ tocbutton +
		'</td>'+
		'<td>'+
		'<div class="formwrapper">'+
		'<input type="text" class="form-control" id="helpsearch" />'+
		'<a id="searchbutton"><img src="../images/glass.svg" alt="' + search_button_alt + '"/></a>'+
		'<a id="clearbutton"><img src="../images/clearbutton.svg" alt="' + clear_button_alt + '"/></a>'+
		'</div>'+
		'</td>' + arrowbuttons +
		'</tr></table>'+
		'</nav><div id="shell">' + shellcontent + 
		'<div id="resultpanel"></div>' + tocpanel + '</div>'
		);
// Briefly show TOC to calculate line height for buttons
	$("#tocpanel").show();
// Check current page location for TOC expansion and highlighting
	var currentpage = $(location).attr("href");
	currentpage = currentpage.match(/[^/]+$/)[0];
	var currentpagelink = $("[href$='"+currentpage+"']");
	if (currentpagelink) {
		currentpagelink.parents("li").addClass("selected");		
	}
	if ($(location).attr("search")) {
		var searchtext = decodeURI($(location).attr("search"));
		searchtext = searchtext.replace(/\?searchtext=/,"");
		$("#helpsearch").val(searchtext);
	}
	
// Convert to navAccordion style
	$('.map').navAccordion({
			expandButtonText: '<img src="../images/plus.svg" height="16px" width="16px" />',  //Text inside of buttons can be HTML
			collapseButtonText: '<img src="../images/minus.svg" height="16px" width="16px" />',
			buttonWidth: "3.5rem",
			buttonPosition: "start",
			headersOnly: true
		});
	
// Hide tocpanel	
	$("#tocpanel").hide();

// Hide related links nav
	$(".relinfo").hide();
	
// Define function for searchbutton click
	$("#searchbutton").click(function() {
		if (($("#helpsearch").val().length > 0) && ($("#helpsearch").val().match(/\S/))){
			$("#searchbutton").hide();
			$("#clearbutton").show();
			var searchtext = $("#helpsearch").val();
			searchtext = searchtext.trim();

			$("#helpsearch").val(searchtext);
			var resultset = fuse.search(searchtext);
			var searchresults = '';
			var searchtexturl = encodeURI(searchtext);
			for (let i in resultset.slice(0,options.maxResults)) {
				searchresults = searchresults + 
				'<li><p><a href="' + 
				resultset[i].item.path + 
				'?searchtext=' +
				searchtexturl +
				'">' + 
				resultset[i].item.title + 
				'</a></p><p>';
				if (resultset[i].item.content.length > snippetLength) {
					searchresults = searchresults + 
						resultset[i].item.content.substr(0,snippetLength) + 
						'...</p></li>';
				} else {
					searchresults = searchresults + 
						resultset[i].item.content + 
						'</p></li>';
				}
			}
			$("#resultpanel").hide();
			if(resultset.length > 0) {
				$("#resultpanel").html("<ul>" + searchresults +"</ul>");
				$("#resultpanel").slideDown();
				$("#shell").scrollTop( 0 );
			} else {
				$("#resultpanel").html('<center>'+ noresults + '</center>');
				$("#resultpanel").slideDown(100,"linear");
				$("#shell").scrollTop( 0 );
			}
			$("#shell").scrollTop( 0 );
		} else {
			$("#helpsearch").val("");
		}

// Define function for clearbutton click
	});	
	$("#clearbutton").click(function() {
		$("#resultpanel").hide()
		$("#resultpanel").html('');
		searchtext = $("#helpsearch").val('');
		searchresults = '';
		$("#clearbutton").hide();
		$("#searchbutton").show();
	});
	
// Define function for new string added to helpsearch input
	$("#helpsearch").on('input',function() {
		if ($("#helpsearch").val().length > 0) {
			$("#clearbutton").hide();
			$("#searchbutton").show();
			$("#tocbutton_selected").hide();
			$("#tocpanel").hide();
			$("#tocbutton").show();
		}
	});

// Define function for focus event if the helpsearch input includes content
	$("#helpsearch").focus(function() {
		$("#searchbutton").css("background-color", "#71C5E8");
		$("#tocbutton_selected").hide();
		$("#tocpanel").hide();
		$("#tocbutton").show();
	});

// Define function for blur event if the helpsearch input includes content
	$("#helpsearch").blur(function() {
		$("#searchbutton").css("background-color", "#CCCCCC");
	});
	
//Define function for clicking the selected tocbutton
	$("#tocbutton_selected").click(function() {
		$("#tocpanel").slideUp("fast",
			function (){
				$("#tocbutton_selected").hide();
				$("#tocbutton").show();
		});
	});
	
//Define function for clicking the tocbutton
	$("#tocbutton").click(function () {
		$("#resultpanel").hide();
		$("#resultpanel").html('');
		searchtext = $("#helpsearch").val('');
		searchresults = '';
		$("#clearbutton").hide();
		$("#searchbutton").show();

		$("#tocpanel").slideDown(function () {
			if (currentpagelink) {
				currentpagelink.focus();
			}
		});		
		$("#tocbutton_selected").show();
		$("#tocbutton").hide();
	});
});
		
