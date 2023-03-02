
ymaps.ready(init1);
function init1(){
	var suggestView=new ymaps.SuggestView('address');
	suggestView.events.add('select',function(event){
		var selected=event.get('item').value;
		ymaps.geocode(selected,{
			results:1
		}).then(function(res){
			return ymaps.geocode(res.geoObjects.get(0).geometry.getCoordinates(),{
				kind:'district',
				results:10
			}).then(function(res){
				var founded=res['metaData']['geocoder']['found'];
				$('label.suggest .description').html("");
				for(i=0;i<=founded-1;i++){
					var info=res.geoObjects.get(i).properties.getAll();
					console.log(info);
					var name=info['name'];
					if(name.search('район')!=-1){
						name=name.replace(' район','');
						console.log(name);
					}
				}
			});
		});
	});
//установка смещения блока подсказок по вертикали
document.getElementsByTagName('ymaps')[0].style.top = document.getElementsByTagName('ymaps')[0].style.top.match(/d+/)*1 + 5 + 'px';
//установка смещения блока подсказок по горизонтали
document.getElementsByTagName('ymaps')[0].style.left = document.getElementsByTagName('ymaps')[0].style.left.match(/d+/)*1 - 1 + 'px';
}
