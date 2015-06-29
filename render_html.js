

    


	var url='plan.json';
	
	

	var data_json = $.getJSON(url).done(function(data) {
    
  
    //console.log(data);
    $('#course-manage').append(render_data(data));
    
    $(" #list2,.years").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div>testtest</div></li>" });
  
  });

	       
	function render_data(data){
		var title = "<h2>"+data.name+"</h2>";
		title = title+'<div id="years-lists">';
		var i = 0;
		 for (var key in data.course) {
		  if (data.course.hasOwnProperty(key)) {
		  	i++;
		  	title = title+" "+render_year(key,data.course[key],i);
		    //alert(key + " -> " + data.course[key]);
		  }
		}
		title = title+"</div>";
		console.log(data);
		console.log(title);
		return title;
	}

	function render_year(key,data,year){

		var content = "<div>";
		content = content + "<h2>"+key+"</h2>";
		
		
		for(var key_i in data){
			 if (data.hasOwnProperty(key_i)) {
			 	content = content + render_semester(key_i,data[key_i],year);

			 }


		}
		
		content = content+"</div>";

		return content;
	}


	function render_semester(key,data,year){

		var content = '<p class="semester">'+key+'</p> ';
		content = content + '<ul id="'+key+'-'+year+'" data-year="'+year+'" class="years">';
		$.each(data,function(index,value){
			content = content + "<li><div data-couse-id="+value+">"+value+"</div><li>";
		});
		content = content + "</ul>";
		console.log("adisak"+data);
		return content;
	}





	var data_test = $.getJSON(url);
	var test = data_test.responseText;
	


   






function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function addYears(){
  HTMLTest = "<div><h2>Years %count%</h2><ul id='year%count%' data-year='%count%' class='years'></ul></div>";
  count = $('.course').siblings().length + 1;
  HTMLTest = replaceAll("%count%", count, HTMLTest);
  $(HTMLTest).insertAfter($('.course').siblings(':last'));
  $('#list2, .years').dragsort("destroy");
  testDrag();
}

function testDrag() {
  	$(" #list2, .years").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: saveOrder, placeHolderTemplate: "<li class='placeHolder'><div>testtest</div></li>" });
}

