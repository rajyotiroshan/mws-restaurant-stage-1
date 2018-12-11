let res_cache = "res_cache_v2";
let urlsToCatche = [//add request url to the res_cache
					'/',
					'/index.html',
					'/restaurant.html',
					...imgs,
					'/css/styles.css',
					'/js/dbhelper.js',
					'/js/main.js',
					'/js/restaurant_info.js',
					'/data/restaurants.json',
				];
let imgs = [];
for(let i=0;i<10;i++){
	imgs.push(`/img/${i+1}.jpg`);
}
//listen for sw install event.
self.addEventListener("install",function(event){
	//wait untill all req are cached.
	event.waitUntil(
		caches.open(res_cache)
		.then(function(cache){
			return cache.addAll(urlsToCache);
		})
		);
});

//listen for swfetch event.
self.addEventListener("fetch",function(event){
	//interrupt fetch request.
	event.respondWith(
		//check if requested urls are cached already.

		caches.match(event.request)
		.then(function(response){
			if(response){//requested urls matched with stored urls in cache.
				return response; //stored cache
			}
			else {//some or at all no urls matched.
				return fetch(event.request).then(function(response){
					const NewResponse = response.clone();
					caches.open(res_cache)
					.then(function(cache){
						cache.put(event.request,NewResponse);
						return response;
					})
					.catch(function(error){
						console.log(error);
					})
				});
			}
		})	
		);
});
